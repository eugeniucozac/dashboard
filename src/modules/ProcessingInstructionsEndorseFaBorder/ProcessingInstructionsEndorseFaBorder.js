import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router';
import moment from 'moment';
import uniqBy from 'lodash/uniqBy';
import isEqual from 'lodash/isEqual';
import get from 'lodash/get';
import * as Yup from 'yup';

// app
import ProcessingInstructionsEndorseFaBorderView from './ProcessingInstructionsEndorseFaBorder.view';
import {
  showModal,
  getUsersForRole,
  selectUser,
  selectUsersInRoles,
  getBordereauPolicyTypes,
  updateProcessingInstruction,
  submitProcessingInstruction,
  getIsRiskReferenceDocumentCountLoading,
  enqueueNotification,
  selectPiProducingBrokers,
  selectPiAccountExecutives,
  getRiskReferenceDocumentsCount,
} from 'stores';
import { PI_STATUS_SUBMITTED_PROCESSING, FRONT_END_CONTACT, OPERATIONS_LEAD, AUTHORISED_SIGNATORY } from 'consts';
import * as utils from 'utils';
import config from 'config';
import * as constants from 'consts';

ProcessingInstructionsEndorseFaBorder.propTypes = {
  instruction: PropTypes.object.isRequired,
  handlers: PropTypes.shape({
    back: PropTypes.func.isRequired,
  }).isRequired,
};

export default function ProcessingInstructionsEndorseFaBorder({ instruction, handlers, childRef }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const { id, step, tab } = useParams();

  const user = useSelector(selectUser);
  const users = useSelector(selectUsersInRoles);
  const bordereauPolicyTypes = useSelector((state) => get(state, 'processingInstructions.bordereauPolicyTypes'));
  const producingBrokersFromRoles = useSelector(selectPiProducingBrokers);
  const accountExecutivesFromRoles = useSelector(selectPiAccountExecutives);
  const isRiskReferenceDocumentCountLoading = useSelector(getIsRiskReferenceDocumentCountLoading);
  const documents = useSelector((state) => get(state, 'processingInstructions.documents')) || {};
  const businessProcesses = useSelector((state) => get(state, 'referenceData.businessProcesses'));

  const isDraft = utils.processingInstructions.status.isDraft(instruction?.statusId);
  const isRejectedDraft = utils.processingInstructions.status.isRejectedDraft(instruction?.statusId);
  const isSubmittedProcessing = utils.processingInstructions.status.isSubmittedProcessing(instruction?.statusId);
  const isReopened = utils.processingInstructions.status.isReopened(instruction?.statusId);
  const userHasWritePermission = utils.app.access.feature('processingInstructions.processingInstructions', ['create', 'update'], user);
  const isEditable = userHasWritePermission && (isDraft || isRejectedDraft || isReopened);
  const isReadOnly = !isEditable;
  const isEndorsement = utils.processingInstructions.isEndorsement(instruction?.processTypeId);
  const isBordereau = utils.processingInstructions.isBordereau(instruction?.processTypeId);
  const isFeeAndAmendment = utils.processingInstructions.isFeeAndAmendment(instruction?.processTypeId);
  const faBorderProcessType = isBordereau || isFeeAndAmendment;
  const riskReferences = instruction?.riskReferences;
  const leadRef = riskReferences?.find((r) => r.leadPolicy);
  const leadRefProducingBrokerFirstGXBValue = leadRef?.gxbAttributeDefaultValues?.producingBrokers?.map((pb) => ({
    name: pb?.name,
  }))?.[0];
  const leadRefAccountExecutiveFirstGXBValue = leadRef?.gxbAttributeDefaultValues?.accountExecutives?.map((ae) => ({
    name: ae?.name,
  }))?.[0];
  const gxbWarrantyDetails = leadRef?.gxbAttributeDefaultValues?.warrantyDetails;

  // ToDO
  // const gxbRiskRefFECs = utils.generic.isValidArray(riskReferences, true)
  //   ? riskReferences
  //       ?.reduce((acc, curr) => {
  //         return [...acc, ...(curr?.gxbAttributeDefaultValues?.workFlowFrontEndContacts?.filter((gxbFecs) => gxbFecs?.gxbUseId) ?? [])];
  //       }, [])
  //       ?.map((fec) => ({ id: fec?.gxbUseId, name: `${fec?.name} - ${fec?.emailId}` })) || []
  //   : [];

  const gxbProducingBrokers = utils.generic.isValidArray(riskReferences, true)
    ? riskReferences
        ?.reduce((acc, curr) => {
          return [...acc, ...curr?.gxbAttributeDefaultValues?.producingBrokers];
        }, [])
        ?.filter((value, index, self) => index === self?.findIndex((t) => t?.name === value?.name)) // Add 'id' also for removing duplicate records from array once API sending 'id' info
        ?.map((pb, idx) => ({ id: idx, name: pb?.name, emailId: pb?.emailId })) || [] // Will Remove 'idx' once API send gxbUserId
    : [];

  const gxbAccountExecutives = utils.generic.isValidArray(riskReferences, true)
    ? riskReferences
        ?.reduce((acc, curr) => {
          return [...acc, ...curr?.gxbAttributeDefaultValues?.accountExecutives];
        }, [])
        ?.filter((value, index, self) => index === self?.findIndex((t) => t?.name === value?.name)) // Add 'id' also for removing duplicate records from array once API sending 'id' info
        ?.map((ae, idx) => ({ id: idx, name: ae?.name, emailId: ae?.emailId })) || [] // Will Remove 'idx' once API send gxbUserId
    : [];

  const piHighPriority = instruction?.details?.highPriority || leadRef?.gxbAttributeDefaultValues?.highPriority;
  const piFrontEndSendDocs = instruction?.details?.frontEndSendDocs || leadRef?.gxbAttributeDefaultValues?.frontEndSendDocs;
  const referenceList =
    utils.generic.isValidArray(documents?.riskReferences, true) &&
    documents?.riskReferences?.map((refData) => ({
      endorsementId: refData.endorsementId,
      endorsementNumber: refData.endorsementNumber,
      riskRefId: refData.riskRefId,
      xbInstanceId: refData.xbInstanceId,
      xbPolicyId: refData.xbPolicyId,
    }));
  const documentTypeValue = isEndorsement
    ? constants.PI_ENDORSEMENT_TYPE_DOCUMENT.documentTypeDescription
    : faBorderProcessType
    ? constants.PI_FABORDER_TYPE_DOCUMENT.documentTypeDescription
    : constants.PI_CLOSING_FDO_TYPE_DOCUMENT.documentTypeDescription;

  const bordereauTypes = [
    {
      id: 1,
      name: 'premium',
      value: 'premium',
      label: utils.string.t('processingInstructions.processingInstructionsForEndFaBorder.fields.premium'),
    },
    {
      id: 2,
      name: 'claims',
      value: 'claims',
      label: utils.string.t('processingInstructions.processingInstructionsForEndFaBorder.fields.claims'),
    },
    {
      id: 3,
      name: 'combined',
      value: 'combined',
      label: utils.string.t('processingInstructions.processingInstructionsForEndFaBorder.fields.combined'),
    },
  ];

  const feeAndAmendmentTypes = [
    {
      name: 'fee',
      value: 'fee',
      label: utils.string.t('processingInstructions.processingInstructionsForEndFaBorder.fields.fee'),
    },
    {
      name: 'amendment',
      value: 'amendment',
      label: utils.string.t('processingInstructions.processingInstructionsForEndFaBorder.fields.amendment'),
    },
  ];
  const tabs = [
    { value: 'processing-instruction', label: utils.string.t('processingInstructions.processingInstructionsForEndFaBorder.tabs.pi') },
    {
      value: 'documents',
      label: `${utils.string.t('processingInstructions.processingInstructionsForEndFaBorder.tabs.attachDoc')}${isEndorsement ? '*' : ''}`,
    },
  ];
  const isValidTab = tabs.map((item) => item.value).includes(tab);

  const [defaultValues, setDefaultValues] = useState();
  const [selectedTab, setSelectedTab] = useState(isValidTab ? tab : 'processing-instruction');

  useEffect(() => {
    dispatch(getUsersForRole([FRONT_END_CONTACT, OPERATIONS_LEAD, AUTHORISED_SIGNATORY]));
    dispatch(getBordereauPolicyTypes());
  }, [dispatch]);

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

  useEffect(() => {
    if (!utils.generic.isValidArray(referenceList, true) || !documentTypeValue) return;
    dispatch(getRiskReferenceDocumentsCount(referenceList, documentTypeValue));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const filterUsersByRole = (roleNames) => {
    return riskReferences?.reduce((acc, cur) => {
      const groupDepartXbInstanceIds = `${cur.departmentId}-${cur.xbInstanceId}`;
      return [
        ...acc,
        ...users
          .filter((u) => roleNames.includes(u.userRole))
          .filter((u) =>
            u.departmentId
              ?.split(',')
              .map((x) => x.trim())
              .includes(groupDepartXbInstanceIds)
          )
          .map((u) => {
            return { id: u.userId, name: u.fullName + ' - ' + u.emailId };
          }),
      ];
    }, []);
  };

  const frontEndContactsForRoles = uniqBy(filterUsersByRole([FRONT_END_CONTACT, OPERATIONS_LEAD]), 'id');
  // TODO
  // const frontEndContacts = utils.generic.isValidArray(gxbRiskRefFECs, true) ? gxbRiskRefFECs : frontEndContactsForRoles; // ToDo
  const frontEndContacts = frontEndContactsForRoles;
  const producingBrokers = utils.generic.isValidArray(gxbProducingBrokers, true) ? gxbProducingBrokers : producingBrokersFromRoles;
  const accountExecutives = utils.generic.isValidArray(gxbAccountExecutives, true) ? gxbAccountExecutives : accountExecutivesFromRoles;

  const getBordereauPolicyTypeId = () => {
    let bordereauPolicyTypeId = instruction.details?.bordereauPolicyTypeId;

    if (!bordereauPolicyTypeId && utils.generic.isValidArray(bordereauPolicyTypes, true)) {
      const item = bordereauPolicyTypes.find((type) => type.bordereauPolicyTypeID === instruction?.details?.bordereauPolicyTypeId);
      bordereauPolicyTypeId = item?.bordereauPolicyTypeID;
    }

    return bordereauPolicyTypeId || '';
  };

  const getBordereauTypeValue = () => {
    const defaultId = 1;
    const defaultType = 'premium';
    const bordereauTypeId = instruction?.details?.bordereauTypeId || defaultId;

    const obj = bordereauTypes.find((type) => type.id === bordereauTypeId);
    return obj?.value || defaultType;
  };

  const validateWarrantyListValue = () => {
    if (!instruction?.details?.ppwOrPpcValue && !instruction?.details?.ppwOrPpcValue) {
      if (gxbWarrantyDetails?.isInvalidData === 0 && utils.generic.isValidArray(gxbWarrantyDetails?.warrantyList, true)) {
        return { flag: true };
      } else if (
        (gxbWarrantyDetails?.isInvalidData === 0 || gxbWarrantyDetails?.isInvalidData === 1) &&
        !utils.generic.isValidArray(gxbWarrantyDetails?.warrantyList, true)
      ) {
        return {
          falg: false,
          displayError: gxbWarrantyDetails?.isInvalidData === 1,
        };
      }
    } else {
      return { flag: instruction?.details?.ppwOrPpc || false };
    }
    return false;
  };

  const fields = [
    {
      name: 'frontEndContactId',
      type: 'select',
      label: utils.string.t('processingInstructions.processingInstructionsForEndFaBorder.fields.frontEndContact'),
      value: instruction?.details?.frontEndContactId || user?.id || '',
      options: frontEndContacts,
      validation: Yup.string().required(utils.string.t('validation.required')),
      optionKey: 'id',
      optionLabel: 'name',
      muiComponentProps: {
        disabled: isReadOnly,
      },
    },
    isFeeAndAmendment
      ? {
          name: 'producingBrokerId',
          group: 'general',
          type: 'select',
          label: utils.string.t('processingInstructions.checklist.fields.producingBroker'),
          value: instruction?.details?.producingBrokerName || leadRefProducingBrokerFirstGXBValue?.name || '',
          validation: Yup.string().required(utils.string.t('validation.required')),
          options: producingBrokers,
          optionKey: 'name', // Will update it with 'id' once api send id details
          optionLabel: 'name',
          muiComponentProps: {
            disabled: isReadOnly || utils.generic.isInvalidOrEmptyArray(producingBrokers),
          },
        }
      : {
          name: 'accountExecutiveId',
          type: 'select',
          label: utils.string.t('processingInstructions.processingInstructionsForEndFaBorder.fields.accountExecutive'),
          value: instruction?.details?.accountExecutive || leadRefAccountExecutiveFirstGXBValue?.name || '',
          validation: Yup.string().required(utils.string.t('validation.required')),
          options: accountExecutives,
          optionKey: 'name', // Will update it with 'id' once api send id details
          optionLabel: 'name',
          muiComponentProps: {
            disabled: isReadOnly,
          },
        },
    {
      name: 'frontEndSendDocs',
      type: 'checkbox',
      label: utils.string.t('processingInstructions.processingInstructionsForEndFaBorder.fields.frontEndSendDocuments'),
      value: piFrontEndSendDocs,
      muiComponentProps: {
        disabled: isReadOnly,
      },
    },
    {
      name: 'highPriority',
      type: 'checkbox',
      label: utils.string.t('processingInstructions.processingInstructionsForEndFaBorder.fields.highPriority'),
      value: piHighPriority,
      muiComponentProps: {
        disabled: isReadOnly,
      },
    },
    {
      name: 'notes',
      type: 'textarea',
      label: utils.string.t('processingInstructions.processingInstructionsForEndFaBorder.notes.label'),
      value: instruction?.details?.notes || '',
      muiComponentProps: {
        multiline: true,
        minRows: 5,
        maxRows: 10,
        disabled: isReadOnly,
      },
    },
    ...(isEndorsement
      ? [
          {
            name: 'ppwOrPpc',
            type: 'checkbox',
            value: validateWarrantyListValue()?.flag || false,
            displayError: validateWarrantyListValue()?.displayError || false,
            label: utils.string.t('processingInstructions.processingInstructionsForEndFaBorder.fields.ppwPpc'),
            muiComponentProps: {
              disabled: isReadOnly,
            },
          },
        ]
      : []),
    ...(isEndorsement || isFeeAndAmendment
      ? [
          {
            name: 'isNonPremium',
            type: 'checkbox',
            value: leadRef?.isNonPremium === 'Yes',
            label: utils.string.t('processingInstructions.processingInstructionsForEndFaBorder.fields.nonPremium'),
            disabled: true,
          },
        ]
      : []),
    ...(isFeeAndAmendment
      ? [
          {
            name: 'feeOrAmendment',
            type: 'radio',
            title: utils.string.t('processingInstructions.processingInstructionsForEndFaBorder.type.label'),
            value: instruction?.details?.feeOrAmendment || 'fee',
            options: feeAndAmendmentTypes,
            validation: Yup.string().required(utils.string.t('validation.required')),
            muiFormGroupProps: {
              row: true,
            },
            muiComponentProps: {
              disabled: isReadOnly,
            },
          },
        ]
      : []),
    ...(isBordereau
      ? [
          {
            name: 'bordereauPolicyTypeId',
            type: 'select',
            label: utils.string.t('processingInstructions.processingInstructionsForEndFaBorder.fields.policyType'),
            value: getBordereauPolicyTypeId(),
            validation: Yup.string().required(utils.string.t('validation.required')),
            options: bordereauPolicyTypes,
            optionKey: 'bordereauPolicyTypeID',
            optionLabel: 'bordereauPolicyTypeDetails',
            muiComponentProps: {
              disabled: isReadOnly,
            },
          },
          {
            type: 'datepicker',
            name: 'bordereauPeriod',
            label: utils.string.t('processingInstructions.processingInstructionsForEndFaBorder.fields.bordereauPeriod'),
            value: instruction?.details?.bordereauPeriod || null,
            validation: Yup.string().required(utils.string.t('validation.required')),
            outputFormat: 'iso',
            placeholder: 'MM YYYY',
            muiComponentProps: {
              fullWidth: true,
              helperText: utils.string.t(
                'processingInstructions.processingInstructionsForEndFaBorder.bordereauPeriod.helperTextBordereauPeriod'
              ),
              disabled: isReadOnly,
            },
            muiPickerProps: {
              views: ['year', 'month'],
              format: 'MM YYYY',
              clearable: true,
            },
          },
          {
            name: 'bordereauTypeId',
            type: 'radio',
            title: utils.string.t('processingInstructions.processingInstructionsForEndFaBorder.bordereauType.label'),
            value: getBordereauTypeValue(),
            validation: Yup.string().required(utils.string.t('validation.required')),
            options: bordereauTypes,
            muiFormGroupProps: {
              row: true,
            },
            muiComponentProps: {
              disabled: isReadOnly,
            },
          },
        ]
      : []),
  ];

  const getSelectedFrontEndContactName = (fecId) => {
    const selectedFecName = frontEndContacts?.find((fec) => fec.id === fecId)?.name;
    return selectedFecName?.split('-')[0]?.trim() || '';
  };

  const getSelectedFrontEndContactEmail = (fecId) => {
    const fecEmailId = frontEndContacts?.find((fec) => fec.id === fecId)?.name;
    return fecEmailId?.split('-')[1]?.trim() || '';
  };

  const getSelectedProducingBrokerName = (pbId) => {
    const selectedProducingBrokerName = producingBrokers?.find((pb) => pb?.name === pbId)?.name; // Will replace pb?.name with pb?.id once api send id information
    return selectedProducingBrokerName;
  };

  //TODO
  // const getSelectedProducingBrokerEmail = (pbId) => {
  //   const selectedProducingBrokerName = producingBrokers?.find((pb) => pb?.id === pbId)?.emailId;
  //   return selectedProducingBrokerName;
  // };

  const getSelectedAccountExecutiveName = (aeId) => {
    const selectedAccountExecutiveName = accountExecutives?.find((ae) => ae?.name === aeId)?.name; // Will replace ae?.name with ae?.id once api send id information
    return selectedAccountExecutiveName;
  };

  //TODO
  // const getSelectedAccountExecutiveEmail = (aeId) => {
  //   const selectedAccountExecutiveEmail = accountExecutives?.find((ae) => ae?.id === aeId)?.emailId;
  //   return selectedAccountExecutiveEmail;
  // };

  const getUpdatedInstruction = (instruction, formValues) => {
    let defaultWarrantyDetails = utils.generic.isValidArray(gxbWarrantyDetails?.warrantyList, true)
      ? gxbWarrantyDetails?.warrantyList.find((a) => a.isSelected)
      : null;

    const { producingBrokerId, accountExecutiveId, ...formValuesWithoutProducingBrokerIdAndAccountExecutiveId } = formValues;
    return {
      ...instruction,
      details: {
        ...formValuesWithoutProducingBrokerIdAndAccountExecutiveId,
        instructionId: instruction?.id,
        ...(isFeeAndAmendment && {
          producingBrokerName: getSelectedProducingBrokerName(formValues?.producingBrokerId),
          //TODO
          // producingBrokerId: formValues?.producingBrokerId,
          // producingBrokerEmailId: getSelectedProducingBrokerEmail(formValues?.producingBrokerId),
        }),
        ...(!isFeeAndAmendment && {
          accountExecutive: getSelectedAccountExecutiveName(formValues?.accountExecutiveId),
          //TODO
          // accountExecutiveId: formValues?.accountExecutiveId,
          // accountExecutiveEmailId: getSelectedAccountExecutiveEmail(formValues?.accountExecutiveId),
        }),
        frontEndContact: getSelectedFrontEndContactName(formValues?.frontEndContactId),
        frontEndContactId: formValues?.frontEndContactId,
        frontEndContactEmail: getSelectedFrontEndContactEmail(formValues?.frontEndContactId),
        ...(isEndorsement && {
          ppwOrPpcValue: formValues['ppwOrPpc']
            ? defaultWarrantyDetails && (defaultWarrantyDetails?.warrantyCode || defaultWarrantyDetails?.code)
              ? defaultWarrantyDetails?.warrantyCode || defaultWarrantyDetails?.code || 'NA'
              : constants.DEFAULT_WARRANTY
            : 'NA',
          warrantyDescription: formValues['ppwOrPpc']
            ? defaultWarrantyDetails && (defaultWarrantyDetails?.warrantyName || defaultWarrantyDetails?.warrantyDescription)
              ? defaultWarrantyDetails?.warrantyName || defaultWarrantyDetails?.warrantyDescription || 'NA'
              : constants.DEFAULT_WARRANTY
            : 'NA',
          warrantyTypeId: formValues['ppwOrPpc']
            ? defaultWarrantyDetails && (defaultWarrantyDetails?.warrantyTypeId || defaultWarrantyDetails?.warrantyTypeID)
              ? defaultWarrantyDetails?.warrantyTypeId || defaultWarrantyDetails?.warrantyTypeID || 'NA'
              : constants.DEFAULT_WARRANTY
            : 'NA',
          warrantyDate: formValues['ppwOrPpc']
            ? defaultWarrantyDetails && defaultWarrantyDetails?.warrantyDate
              ? defaultWarrantyDetails?.warrantyDate || null
              : null
            : null,
          warrantyCode: formValues['ppwOrPpc']
            ? defaultWarrantyDetails && (defaultWarrantyDetails?.warrantyCode || defaultWarrantyDetails?.code)
              ? defaultWarrantyDetails?.warrantyCode || defaultWarrantyDetails?.code || 'NA'
              : constants.DEFAULT_WARRANTY
            : 'NA',
        }),
        ...(isBordereau && {
          bordereauPeriod: formValues.bordereauPeriod ? moment(formValues.bordereauPeriod).format('MMMM YYYY') : '',
          bordereauTypeId: bordereauTypes.find((type) => type.value === formValues.bordereauTypeId)?.id || null,
        }),
      },
    };
  };

  const handleCancel = () => {
    const reset = childRef?.current?.props?.resetFunc;

    if (utils.generic.isFunction(reset)) {
      reset(defaultValues, { keepDirty: false });
    }
  };

  const checkAllRequiredFiledsSelected = () => {
    const formValues = childRef?.current?.props?.values || {};
    const isFrontEndIdSelected = Boolean(formValues?.frontEndContactId);

    if (isEndorsement) {
      const isAccountExecutiveIdSelected = Boolean(formValues?.accountExecutiveId);
      if (isFrontEndIdSelected && isAccountExecutiveIdSelected) {
        return true;
      } else if (!isFrontEndIdSelected && !isAccountExecutiveIdSelected) {
        dispatch(enqueueNotification('processingInstructions.addRiskReference.noFrontEndContactIdAccountExecutiveIdValue', 'warning'));
        return false;
      } else if (!isFrontEndIdSelected) {
        dispatch(enqueueNotification('processingInstructions.addRiskReference.noFrontEndContactIdValue', 'warning'));
        return false;
      } else if (!isAccountExecutiveIdSelected) {
        dispatch(enqueueNotification('processingInstructions.addRiskReference.noAccountExecutiveIdValue', 'warning'));
        return false;
      }
    } else if (isFeeAndAmendment) {
      const isProducingBrokerSelected = Boolean(formValues?.producingBrokerId);
      if (isFrontEndIdSelected && isProducingBrokerSelected) {
        return true;
      } else if (!isFrontEndIdSelected && !isProducingBrokerSelected) {
        dispatch(enqueueNotification('processingInstructions.addRiskReference.noFrontEndContactIdProducingBrokerIdValue', 'warning'));
        return false;
      } else if (!isFrontEndIdSelected) {
        dispatch(enqueueNotification('processingInstructions.addRiskReference.noFrontEndContactIdValue', 'warning'));
        return false;
      } else if (!isProducingBrokerSelected) {
        dispatch(enqueueNotification('processingInstructions.addRiskReference.noProducingBrokerValue', 'warning'));
        return false;
      }
    } else if (isBordereau) {
      const bordereauTypeId = Boolean(formValues?.bordereauTypeId);
      const bordereauPeriod = Boolean(formValues?.bordereauPeriod);
      const bordereauPolicyTypeId = Boolean(formValues?.bordereauPolicyTypeId);
      const accountExecutiveId = Boolean(formValues?.accountExecutiveId);
      if (isFrontEndIdSelected && bordereauTypeId && bordereauPeriod && bordereauPolicyTypeId && accountExecutiveId) {
        return true;
      } else if (!isFrontEndIdSelected) {
        dispatch(enqueueNotification('processingInstructions.addRiskReference.noFrontEndContactIdValue', 'warning'));
        return false;
      } else if (!accountExecutiveId) {
        dispatch(enqueueNotification('processingInstructions.addRiskReference.noAccountExecutiveIdValue', 'warning'));
        return false;
      } else if (!bordereauTypeId) {
        dispatch(enqueueNotification('processingInstructions.addRiskReference.noBordereauTypeId', 'warning'));
        return false;
      } else if (!bordereauPolicyTypeId) {
        dispatch(enqueueNotification('processingInstructions.addRiskReference.noBordereauPolicyType', 'warning'));
        return false;
      } else if (!bordereauPeriod) {
        dispatch(enqueueNotification('processingInstructions.addRiskReference.noBordereauPeriod', 'warning'));
        return false;
      }
    } else {
      return false;
    }
  };

  const handleSave = () => {
    const formValues = childRef?.current?.props?.values || {};
    const updatedInstruction = getUpdatedInstruction(instruction, formValues);
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
            confirmMessage: <span>{utils.string.t('processingInstructions.mandatoryDocuments.mandatoryDocumentUploaded')}</span>,
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
    const isPageEdited = !isEqual(defaultValues, formValues);
    if (checkAllRequiredFiledsSelected()) {
      if (isEndorsement) {
        dispatch(getRiskReferenceDocumentsCount(referenceList, documentTypeValue)).then((response) => {
          if (response?.status === constants.API_RESPONSE_OK) {
            if (response?.data?.some((a) => a.documentCount === 0)) {
              mandatoryDocumentsNotUploaded();
            } else {
              if (isPageEdited) {
                handleSave().then((response) => {
                  if (response?.status === constants.API_RESPONSE_OK) {
                    proceedToSubmission();
                  }
                });
              } else {
                proceedToSubmission();
              }
            }
          }
        });
      } else {
        if (isPageEdited) {
          handleSave().then((response) => {
            if (response?.status === constants.API_RESPONSE_OK) {
              proceedToSubmission();
            }
          });
        } else {
          proceedToSubmission();
        }
      }
    }
  };

  const proceedToSubmission = () => {
    const formValues = childRef?.current?.props?.values || {};
    const updatedInstruction = getUpdatedInstruction(instruction, formValues);
    const businessProcess = businessProcesses?.find(
      (bp) => bp.businessProcessID === updatedInstruction.businessProcessId
    )?.businessProcessName;

    dispatch(
      showModal({
        component: 'CONFIRM',
        props: {
          title: 'processingInstructions.authorisations.form.title',
          fullWidth: true,
          maxWidth: 'sm',
          componentProps: {
            confirmMessage: utils.string.t('processingInstructions.authorisations.form.confirmText'),
            cancelLabel: utils.string.t('processingInstructions.authorisations.form.cancel'),
            confirmLabel: utils.string.t('processingInstructions.authorisations.form.confirm'),
            confirmMessageText: utils.string.t('processingInstructions.authorisations.form.confirmMessage'),
            note: utils.string.t('processingInstructions.authorisations.form.note'),

            submitHandler: () => {
              dispatch(
                submitProcessingInstruction({
                  ...updatedInstruction,
                  businessProcess,
                  statusId: PI_STATUS_SUBMITTED_PROCESSING,
                })
              ).then((res) => {
                if (res?.status === constants.API_RESPONSE_OK) {
                  history.push('/processing-instructions');
                  dispatch(enqueueNotification('processingInstructions.details.submittedSuccessfully', 'success'));
                }
              });
            },
          },
        },
      })
    );
  };

  const toggleTab = (tab) => {
    setSelectedTab(tab);
    history.replace(`${config.routes.processingInstructions.steps}/${id}${step ? `/${step}` : ''}${tab ? `/${tab}` : ''}`);
  };

  // abort
  if (!defaultValues || !instruction || utils.generic.isInvalidOrEmptyArray(users) || !bordereauPolicyTypes) return null;

  return (
    <ProcessingInstructionsEndorseFaBorderView
      instruction={instruction}
      leadRef={leadRef}
      tabs={tabs}
      selectedTab={selectedTab}
      fields={fields}
      defaultValues={defaultValues}
      isEndorsement={isEndorsement}
      isBordereau={isBordereau}
      isFeeAndAmendment={isFeeAndAmendment}
      isReadOnly={isReadOnly}
      isSubmittedProcessing={isSubmittedProcessing}
      isRiskReferenceDocumentCountLoading={isRiskReferenceDocumentCountLoading}
      handlers={{
        ...handlers,
        cancel: handleCancel,
        save: handleSave,
        submit: handleSubmit,
        toggleTab,
      }}
      ref={childRef}
    />
  );
}
