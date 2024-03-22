import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import get from 'lodash/get';
import uniqBy from 'lodash/uniqBy';
import * as Yup from 'yup';
import isEqual from 'lodash/isEqual';

//app
import ProcessingInstructionsAuthorisationView from './ProcessingInstructionsAuthorisation.view';
import {
  updateProcessingInstruction,
  getUsersForRole,
  selectUsersInRoles,
  selectUser,
  showModal,
  submitProcessingInstruction,
  enqueueNotification,
  approveOrRejectInstruction,
  hideModal,
  uploadGeneratedPiPdfToGxb,
  storeResetAllState,
  sendEmailNotification,
  initiateCase,
  selectRefDataNewDocumentTypesByContextSource,
  getMetaDataForPdf,
  updateReferenceDocumentCountLoading,
  getRiskReferenceDocumentsCount,
} from 'stores';
import * as constants from 'consts';
import * as utils from 'utils';
import { savePDF } from 'modules';
// import { downloadPDF } from 'modules'; // download pdf reference
import styles from './ProcessingInstructionsAuthorisation.styles';

//mui
import { Box, makeStyles, Typography } from '@material-ui/core';

ProcessingInstructionsAuthorisation.propTypes = {
  instruction: PropTypes.object.isRequired,
  handlers: PropTypes.shape({
    back: PropTypes.func.isRequired,
  }).isRequired,
  checkListMandatoryDataStatus: PropTypes.bool.isRequired,
  processingInstructionMandatoryDataStatus: PropTypes.bool.isRequired,
};

export default function ProcessingInstructionsAuthorisation({
  instruction,
  handlers,
  childRef,
  checkListMandatoryDataStatus,
  processingInstructionMandatoryDataStatus,
}) {
  const classes = makeStyles(styles)();
  const dispatch = useDispatch();
  const history = useHistory();

  const user = useSelector(selectUser);
  const users = useSelector(selectUsersInRoles);
  const documents = useSelector((state) => get(state, 'processingInstructions.documents')) || {};
  const retainedBrokerageAmountForPdf = useSelector((state) => get(state, 'processingInstructions.retainedBrokerageAmountForPdf'));
  const totalAmountForPdf = useSelector((state) => get(state, 'processingInstructions.totalAmountForPdf'));
  const businessProcesses = useSelector((state) => get(state, 'referenceData.businessProcesses'));
  const isResetAllSelected = useSelector((state) => get(state, 'processingInstructions.isResetAllSelected'));
  const [defaultValues, setDefaultValues] = useState();
  const isSubmittedAuthorisedSignatory = utils.processingInstructions.status.isSubmittedAuthorisedSignatory(instruction?.statusId);
  const isSubmittedProcessing = utils.processingInstructions.status.isSubmittedProcessing(instruction?.statusId);

  const [isReadyToSubmit, setIsReadyToSubmit] = useState(isSubmittedAuthorisedSignatory);
  const isDraft = utils.processingInstructions.status.isDraft(instruction?.statusId);
  const isRejectedDraft = utils.processingInstructions.status.isRejectedDraft(instruction?.statusId);
  const isReopened = utils.processingInstructions.status.isReopened(instruction?.statusId);
  const userHasWritePermission = utils.app.access.feature('processingInstructions.processingInstructions', ['create', 'update'], user);
  const isEditAllowed = userHasWritePermission && (isDraft || isRejectedDraft || isReopened || isResetAllSelected);
  const isReadOnly = !isEditAllowed;
  const refDataCurrencies = useSelector((state) => get(state, 'referenceData.currencyCodes')) || [];

  const isEndorsement = utils.processingInstructions.isEndorsement(instruction?.processTypeId);
  const isFeeAndAmendment = utils.processingInstructions.isFeeAndAmendment(instruction?.processTypeId);
  const isBordereau = utils.processingInstructions.isBordereau(instruction?.processTypeId);
  const faBorderProcessType = isBordereau || isFeeAndAmendment;

  const riskReferences = instruction?.riskReferences;
  const leadRef = riskReferences?.find((r) => r.leadPolicy);

  // ToDO
  // const gxbRiskRefFECs = utils.generic.isValidArray(riskReferences, true)
  //   ? riskReferences
  //       ?.reduce((acc, curr) => {
  //         return [...acc, ...(curr?.gxbAttributeDefaultValues?.workFlowFrontEndContacts?.filter((gxbFecs) => gxbFecs?.gxbUseId) ?? [])];
  //       }, [])
  //       ?.map((fec) => ({ id: fec?.gxbUseId, name: `${fec?.name} - ${fec?.emailId}` })) || []
  //   : [];

  const handleResetAll = () => {
    dispatch(storeResetAllState(true));
  };
  // check the documents are uploaded or not in the risk reference and details steps
  const isAllowPremiumTaxValidation =
    utils.processingInstructions.getFinancialField(instruction, 'premiumTaxCalculationSheetAttached')?.numberValue === 1 ? true : false;
  const isAllowSignedLinesValidation =
    utils.processingInstructions.getFinancialField(instruction, 'signedLinesCalculationSheetAttached')?.numberValue === 1 ? true : false;
  const isNoPremiumTaxDocumentExist = !documents?.premiumTaxDocument ? true : false;
  const isNoSignedLinesDocumentExist = !documents?.signedLinesDocument ? true : false;

  const [isAnyRiskRefHavingNoDocument, setIsAnyRiskRefHavingNoDocument] = useState(false);

  useEffect(() => {
    dispatch(getUsersForRole([constants.FRONT_END_CONTACT, constants.OPERATIONS_LEAD, constants.AUTHORISED_SIGNATORY]));
  }, [dispatch]);

  useEffect(() => {
    if (!isSubmittedProcessing && !isSubmittedAuthorisedSignatory && utils.generic.isValidArray(documents?.riskReferences, true)) {
      dispatch(updateReferenceDocumentCountLoading(true));
      const referenceList = documents?.riskReferences?.map((refData) => {
        return {
          endorsementId: refData.endorsementId,
          endorsementNumber: refData.endorsementNumber,
          riskRefId: refData.riskRefId,
          xbInstanceId: refData.xbInstanceId,
          xbPolicyId: refData.xbPolicyId,
        };
      });
      const documentTypeValue = isEndorsement
        ? constants.PI_ENDORSEMENT_TYPE_DOCUMENT.documentTypeDescription
        : faBorderProcessType
        ? constants.PI_FABORDER_TYPE_DOCUMENT.documentTypeDescription
        : constants.PI_CLOSING_FDO_TYPE_DOCUMENT.documentTypeDescription;
      dispatch(getRiskReferenceDocumentsCount(referenceList, documentTypeValue)).then((response) => {
        if (response?.status === constants.API_RESPONSE_OK) {
          setIsAnyRiskRefHavingNoDocument(response?.data?.some((a) => a.documentCount === 0));
        }
      });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const filterUsersByRole = (roleNames) => {
    return riskReferences?.reduce((acc, cur) => {
      const groupDepartXbInstanceIds = `${cur?.departmentId}-${cur?.xbInstanceId}`;
      return [
        ...acc,
        ...users
          ?.filter((u) => roleNames?.includes(u?.userRole))
          ?.filter((u) =>
            u?.departmentId
              ?.split(',')
              ?.map((x) => x?.trim())
              ?.includes(groupDepartXbInstanceIds)
          )
          ?.map((u) => {
            return { id: u?.userId, name: `${u?.fullName} - ${u?.emailId}` };
          }),
      ];
    }, []);
  };

  const inRolesFrontEndContacts = uniqBy(filterUsersByRole([constants.FRONT_END_CONTACT, constants.OPERATIONS_LEAD]), 'id');
  const operationsLeads = uniqBy(filterUsersByRole([constants.AUTHORISED_SIGNATORY]), 'id');

  // ToDo
  // const frontEndContacts = utils.generic.isValidArray(gxbRiskRefFECs, true) ? gxbRiskRefFECs : inRolesFrontEndContacts;
  const frontEndContacts = inRolesFrontEndContacts;

  const getFrontEndContactEmailId = () => {
    return instruction?.details?.frontEndContactEmail ?? '';
  };

  const getSavedFrontEndContactName = () => {
    return instruction?.details?.frontEndContact ?? '';
  };

  const getSelectedFrontEndContactName = (fecId) => {
    const selectedFecName = frontEndContacts?.find((fec) => fec.id === fecId)?.name;
    return selectedFecName.substring(0, selectedFecName.indexOf('-') - 1);
  };

  const getAuthorizedSignatoryName = () => {
    const asId = instruction?.details?.authorisedSignatoryId;
    const asName = operationsLeads?.find((as) => as.id === asId)?.name;
    return asName;
  };

  const getAccountExecutiveName = () => {
    return instruction?.details?.accountExecutive ?? '';
  };

  const getProducingBrokerName = () => {
    return instruction?.details?.producingBrokerName ?? '';
  };

  const handleCancel = () => {
    const reset = childRef?.current?.props?.resetFunc;

    if (utils.generic.isFunction(reset)) {
      reset(defaultValues, { keepDirty: false });
    }
  };

  const getFecEmailId = (fecId) => {
    const fecEmailId = frontEndContacts?.find((fec) => fec?.id === fecId)?.name;
    return fecEmailId?.split('-')[1]?.trim() || '';
  };

  const handleSave = () => {
    const formValues = childRef?.current?.props?.values;

    const updatedInstruction = {
      ...instruction,
      details: {
        ...instruction.details,
        frontEndContact: getSelectedFrontEndContactName(formValues?.frontEndContact),
        frontEndContactId: formValues?.frontEndContact,
        frontEndContactEmail: getFecEmailId(formValues?.frontEndContact),
        authorisedSignatoryId: formValues.authorisedSignatory,
      },
    };
    return dispatch(updateProcessingInstruction(updatedInstruction));
  };

  const mandatoryDocumentsNotUploaded = () => {
    dispatch(
      showModal({
        component: 'CONFIRM',
        props: {
          fullWidth: true,
          title: utils.string.t('processingInstructions.mandatoryDocuments.error'),
          maxWidth: 'xs',
          componentProps: {
            hideCancelButton: true,
            confirmLabel: utils.string.t('processingInstructions.authorisations.form.confirm'),
            confirmMessage: (
              <Box>
                <Typography className={classes.documentsValidationTitle}>
                  ${utils.string.t('processingInstructions.mandatoryDocuments.mandatoryDocumentUploaded')}
                </Typography>
                <ul>
                  {isAnyRiskRefHavingNoDocument && (
                    <li>{utils.string.t('processingInstructions.mandatoryDocuments.signedSlipDocumentsUploaded')}</li>
                  )}
                  {isAllowPremiumTaxValidation && isNoPremiumTaxDocumentExist && (
                    <li>{utils.string.t('processingInstructions.mandatoryDocuments.premiumTaxDocumentsUploaded')}</li>
                  )}
                  {isAllowSignedLinesValidation && isNoSignedLinesDocumentExist && (
                    <li>{utils.string.t('processingInstructions.mandatoryDocuments.marketSignedLinesDocumentUploaded')}</li>
                  )}
                </ul>
              </Box>
            ),
            buttonColors: { confirm: 'secondary' },
            submitHandler: () => {},
            handleClose: () => {},
          },
        },
      })
    );
  };

  const handleSubmit = () => {
    const formValues = childRef?.current?.props?.values || {};
    const isFrontEndIdSelected = Boolean(formValues?.frontEndContact);
    const isAuthorisedSignatory = Boolean(formValues?.authorisedSignatory);
    const isPageEdited = !isEqual(defaultValues, formValues);
    if (!(isFrontEndIdSelected && isAuthorisedSignatory && isReadyToSubmit)) {
      dispatch(enqueueNotification('processingInstructions.authorisations.fields.missingAuthorisedSignatoryManatoryFields', 'warning'));
    } else if (
      (isAllowPremiumTaxValidation && isNoPremiumTaxDocumentExist) ||
      (isAllowSignedLinesValidation && isNoSignedLinesDocumentExist) ||
      isAnyRiskRefHavingNoDocument
    ) {
      mandatoryDocumentsNotUploaded();
    } else {
      const formValues = childRef?.current?.props?.values || {};
      const businessProcess = businessProcesses?.find((bp) => bp.businessProcessID === instruction.businessProcessId)?.businessProcessName;

      const updatedInstruction = {
        ...instruction,
        businessProcess,
        details: {
          ...instruction.details,
          frontEndContactId: formValues.frontEndContact,
          authorisedSignatoryId: formValues.authorisedSignatory,
        },
      };
      if (isPageEdited) {
        handleSave().then((response) => {
          if (response?.status === constants.API_RESPONSE_OK) {
            dispatch(submitProcessingInstruction(updatedInstruction)).then((res) => {
              if (res?.status === constants.API_RESPONSE_OK) {
                history.push('/processing-instructions');
                dispatch(enqueueNotification('processingInstructions.details.submittedSuccessfully', 'success'));
              }
            });
          }
        });
      } else {
        dispatch(submitProcessingInstruction(updatedInstruction)).then((res) => {
          if (res?.status === constants.API_RESPONSE_OK) {
            history.push('/processing-instructions');
            dispatch(enqueueNotification('processingInstructions.details.submittedSuccessfully', 'success'));
          }
        });
      }
    }
  };

  const getUncheckedWarningMessage = () => {
    const isAuthorizedSignatoryCheckedAll =
      instruction?.checklist?.every((item) => item.authorisedSignatory) &&
      instruction?.financialChecklist?.every((item) => item.approvedByAuthorisedSignatory);
    return !isAuthorizedSignatoryCheckedAll ? utils.string.t('processingInstructions.authorisations.warningText') : '';
  };

  const documentTypesBeforeFilter = useSelector(
    selectRefDataNewDocumentTypesByContextSource(constants.DMS_CONTEXT_INSTRUCTION, constants.PI_GENERATE_PDF_SUBMIT.sourceID)
  );

  const documentTypesAfterFilter = documentTypesBeforeFilter?.filter(
    (type) =>
      type.documentTypeDescription === constants.PI_GENERATE_PDF_SUBMIT.documentTypeDescription &&
      type.sectionKey === constants.PI_GENERATE_PDF_SUBMIT.sectionKey &&
      type.sourceID === constants.PI_GENERATE_PDF_SUBMIT.sourceID
  );

  const handleUploadProcessingInstruction = () => {
    const pdf = savePDF({
      processingInstruction: instruction,
      departmentName: leadRef?.departmentName,
      frontEndContactName: getSavedFrontEndContactName(),
      authorizedSignatoryName: getAuthorizedSignatoryName(),
      accountExecutiveName: getAccountExecutiveName(),
      producingBrokerName: getProducingBrokerName(),
      retainedBrokerageAmountForPdf: retainedBrokerageAmountForPdf,
      totalAmountForPdf: totalAmountForPdf,
      refDataCurrencies: refDataCurrencies,
    });

    dispatch(getMetaDataForPdf({ leadRef, instruction })).then((data) => {
      if (data?.status === constants.API_RESPONSE_OK) {
        dispatch(uploadGeneratedPiPdfToGxb({ pdf, riskRef: leadRef, documentTypesAfterFilter, instruction, metaData: data?.data })).then(
          (res) => {
            if (
              res?.data?.length === 0 ||
              res?.response?.status === constants.API_STATUS_INTERNAL_SERVER_ERROR ||
              res?.response?.status === constants.API_STATUS_NOT_FOUND
            ) {
              dispatch(
                sendEmailNotification({
                  instruction,
                  frontEndContactEmail: getFrontEndContactEmailId(),
                  frontEndContactName: getSavedFrontEndContactName(),
                })
              );
            }
          }
        );
      }
    });
  };

  const handleApprove = () => {
    const instructionType = utils.string.t(`processingInstructions.type.${instruction?.processTypeId}`);
    dispatch(
      showModal({
        component: 'CONFIRM_WITH_COMMENT',
        props: {
          title: utils.string.t('processingInstructions.authorisations.approve.title'),
          width: 'sm',
          maxWidth: 'sm',
          componentProps: {
            confirmLabel: utils.string.t('app.approve'),
            cancelLabel: utils.string.t('app.cancel'),
            warningMessage: getUncheckedWarningMessage(),
            confirmMessage: utils.string.t('processingInstructions.authorisations.approve.text', { instructionType: instructionType }),
            buttonColors: { confirm: 'secondary', cancel: 'primary' },
            commentLabel: utils.string.t('processingInstructions.authorisations.approve.commentLabel'),
            isCommentsMandatory: false,
            commentProps: {
              multiline: true,
              rows: 5,
              rowsMax: 6,
              inputProps: {
                maxLength: 2000,
              },
            },
            confirmHandler: (comment = '') => {
              dispatch(hideModal());
              handleUploadProcessingInstruction();
              dispatch(approveOrRejectInstruction(instruction.id, comment, 'APPROVE')).then((response) => {
                if (response?.status === constants.PI_STATUS_SUBMITTED_PROCESSING_LABEL) {
                  const businessProcess = businessProcesses?.find(
                    (bp) => bp.businessProcessID === instruction.businessProcessId
                  )?.businessProcessName;
                  dispatch(initiateCase({ ...instruction, businessProcess }));
                }
              });
            },
            cancelHandler: () => {
              dispatch(hideModal());
            },
            closeHandler: () => {
              dispatch(hideModal());
            },
          },
        },
      })
    );
  };

  const handleReject = () => {
    const instructionType = utils.string.t(`processingInstructions.type.${instruction?.processTypeId}`);
    dispatch(
      showModal({
        component: 'CONFIRM_WITH_COMMENT',
        props: {
          title: utils.string.t('processingInstructions.authorisations.reject.title'),
          width: 'sm',
          maxWidth: 'sm',
          componentProps: {
            confirmLabel: utils.string.t('app.reject'),
            cancelLabel: utils.string.t('app.cancel'),
            warningMessage: getUncheckedWarningMessage(),
            confirmMessage: utils.string.t('processingInstructions.authorisations.reject.text', { instructionType: instructionType }),
            buttonColors: { confirm: 'secondary', cancel: 'primary' },
            commentLabel: utils.string.t('processingInstructions.authorisations.reject.commentLabel'),
            isCommentsMandatory: true,
            commentProps: {
              multiline: true,
              rows: 5,
              rowsMax: 6,
              inputProps: {
                maxLength: 2000,
              },
            },
            confirmHandler: (comment = '') => {
              dispatch(hideModal());
              dispatch(approveOrRejectInstruction(instruction.id, comment, 'REJECT'));
            },
            cancelHandler: () => {
              dispatch(hideModal());
            },
            closeHandler: () => {
              dispatch(hideModal());
            },
          },
        },
      })
    );
  };

  useEffect(
    () => {
      const reset = childRef?.current?.props?.resetFunc;
      const updatedDefaultValues = {
        ...utils.form.getInitialValues(fields),
      };

      setDefaultValues(updatedDefaultValues);

      if (utils.generic.isFunction(reset)) {
        reset(updatedDefaultValues, {
          keepDirty: false,
        });
      }
    },
    [instruction] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const fields = [
    {
      name: 'frontEndContact',
      type: 'select',
      options: frontEndContacts,
      optionKey: 'id',
      optionLabel: 'name',
      label: utils.string.t('processingInstructions.authorisations.fields.frontEndContact'),
      value: instruction?.details?.frontEndContactId || user?.id || '',
      validation: Yup.string().required(utils.string.t('validation.required')),
      muiComponentProps: {
        disabled: isReadOnly || checkListMandatoryDataStatus || processingInstructionMandatoryDataStatus,
      },
    },
    {
      name: 'authorisedSignatory',
      type: 'select',
      options: operationsLeads,
      optionKey: 'id',
      optionLabel: 'name',
      label: utils.string.t('processingInstructions.authorisations.fields.authorisedSignatory'),
      value: instruction?.details?.authorisedSignatoryId ?? '',
      validation: Yup.string().required(utils.string.t('validation.required')),
      muiComponentProps: {
        disabled: isReadOnly || checkListMandatoryDataStatus || processingInstructionMandatoryDataStatus,
      },
    },
    {
      name: 'readyToSubmit',
      type: 'checkbox',
      value: isReadyToSubmit,
      label: utils.string.t('processingInstructions.authorisations.fields.readyToSubmit'),
      validation: Yup.string().required(utils.string.t('validation.required')),
      muiComponentProps: {
        disabled: isReadOnly || checkListMandatoryDataStatus || processingInstructionMandatoryDataStatus,
        onChange: (name, value) => {
          setIsReadyToSubmit(value);
        },
      },
    },
  ];

  // abort
  if (!defaultValues || !instruction || utils.generic.isInvalidOrEmptyArray(users)) return null;

  // Download PDF reference
  // const handleDownloadPdf = () => {
  //   downloadPDF({
  //     processingInstruction: instruction,
  //     departmentName: leadRef?.departmentName,
  //     frontEndContactName: getSavedFrontEndContactName(),
  //     authorizedSignatoryName: getAuthorizedSignatoryName(),
  //     accountExecutiveName: getAccountExecutiveName(),
  //     producingBrokerName: getProducingBrokerName(),
  //     retainedBrokerageAmountForPdf: retainedBrokerageAmountForPdf,
  //     totalAmountForPdf: totalAmountForPdf,
  //     refDataCurrencies: refDataCurrencies,
  //   });
  // };

  return (
    <ProcessingInstructionsAuthorisationView
      instruction={instruction}
      fields={fields}
      defaultValues={defaultValues}
      isReadyToSubmit={isReadyToSubmit}
      isSubmittedAuthorisedSignatory={isSubmittedAuthorisedSignatory}
      isReadOnly={isReadOnly}
      checkListMandatoryDataStatus={checkListMandatoryDataStatus}
      processingInstructionMandatoryDataStatus={processingInstructionMandatoryDataStatus}
      handlers={{
        ...handlers,
        save: handleSave,
        cancel: handleCancel,
        submit: handleSubmit,
        // downloadPdf: handleDownloadPdf, // download PDF reference
        approve: handleApprove,
        reject: handleReject,
        resetAll: handleResetAll,
      }}
      ref={childRef}
    />
  );
}
