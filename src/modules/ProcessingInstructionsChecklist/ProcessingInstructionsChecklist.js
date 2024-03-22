import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useParams } from 'react-router';
import get from 'lodash/get';
import * as Yup from 'yup';

// app
import ProcessingInstructionsChecklistView from './ProcessingInstructionsChecklist.view';
import { processingInstructionsSchema } from 'schemas';
import {
  enqueueNotification,
  checkListUpdate,
  selectUser,
  selectPiProducingBrokers,
  selectPiAccountExecutives,
  selectPiFacilityTypes,
  updateReferenceDocumentCountLoading,
  getRiskReferenceDocumentsCount,
  getRiskReferencesDocumentsCountList,
  getIsRiskReferenceDocumentCountLoading,
} from 'stores';
import * as utils from 'utils';
import config from 'config';
import * as constants from 'consts';

ProcessingInstructionsChecklist.propTypes = {
  instruction: PropTypes.object.isRequired,
  handlers: PropTypes.shape({
    back: PropTypes.func.isRequired,
    next: PropTypes.func.isRequired,
  }).isRequired,
};

export default function ProcessingInstructionsChecklist({ instruction, handlers, childRef }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const { id, step, tab } = useParams();
  const riskReferencesDocumentsCountList = useSelector(getRiskReferencesDocumentsCountList);
  const isRiskReferenceDocumentCountLoading = useSelector(getIsRiskReferenceDocumentCountLoading);
  const documents = useSelector((state) => get(state, 'processingInstructions.documents')) || {};
  const producingBrokersFromRoles = useSelector(selectPiProducingBrokers);
  const accountExecutivesFromRoles = useSelector(selectPiAccountExecutives);
  const facilityTypes = useSelector(selectPiFacilityTypes);
  const user = useSelector(selectUser);

  const columns = [
    { id: 'detail', label: utils.string.t('processingInstructions.checklist.cols.detail') },
    { id: 'frontEndContact', label: utils.string.t('processingInstructions.checklist.cols.frontEndContact'), align: 'center' },
    { id: 'authorisedSignatory', label: utils.string.t('processingInstructions.checklist.cols.authorisedSignatory'), align: 'center' },
  ];

  const checklistTabs = [
    { value: constants.GENERAL, label: utils.string.t('processingInstructions.checklist.tabs.general.title') },
    { value: constants.PRE_PLACING, label: utils.string.t('processingInstructions.checklist.tabs.prePlacing.title') },
    { value: constants.MRC, label: utils.string.t('processingInstructions.checklist.tabs.mrc.title') },
    { value: constants.OTHER_DETAILS, label: utils.string.t('processingInstructions.checklist.tabs.otherDetails.title') },
    { value: constants.RISK_REFERENCES, label: utils.string.t('processingInstructions.checklist.tabs.riskRefs.title') },
  ];

  const [tabs, setTabs] = useState(checklistTabs);

  const isValidTab = tabs.map((item) => item.value).includes(tab);

  const [selectedTab, setSelectedTab] = useState(isValidTab ? tab : 'general');
  const [defaultValues, setDefaultValues] = useState();
  const [schemaData, setSchemaData] = useState({});
  const [resetKey, setResetKey] = useState();
  const [piSchema, setPiSchema] = useState(processingInstructionsSchema);

  const leadRef = instruction?.riskReferences?.find((r) => r.leadPolicy);
  const leadRefProducingBrokerFirstGXBValue = leadRef?.gxbAttributeDefaultValues?.producingBrokers?.map((pb) => ({
    name: pb?.name,
  }))?.[0];
  const leadRefAccountExecutiveFirstGXBValue = leadRef?.gxbAttributeDefaultValues?.accountExecutives?.map((ae) => ({
    name: ae?.name,
  }))?.[0];
  const isFdo = utils.processingInstructions.isFdo(instruction?.processTypeId);
  const isDraft = utils.processingInstructions.status.isDraft(instruction?.statusId);
  const isRejectedDraft = utils.processingInstructions.status.isRejectedDraft(instruction?.statusId);
  const isSubmittedAuthorisedSignatory = utils.processingInstructions.status.isSubmittedAuthorisedSignatory(instruction?.statusId);
  const isReopened = utils.processingInstructions.status.isReopened(instruction?.statusId);
  const userHasWritePermission = utils.app.access.feature('processingInstructions.processingInstructions', ['create', 'update'], user);
  const userHasApproverAccess = utils.app.access.feature('processingInstructions.approverChecklist', ['create', 'update'], user);
  const isCheckboxesEditable = userHasApproverAccess && isSubmittedAuthorisedSignatory;
  const isEditable = userHasWritePermission && (isDraft || isRejectedDraft || isReopened);
  const isReadOnly = !isEditable;

  const isEndorsement = utils.processingInstructions.isEndorsement(instruction?.processTypeId);
  const isFeeAndAmendment = utils.processingInstructions.isFeeAndAmendment(instruction?.processTypeId);
  const isBordereau = utils.processingInstructions.isBordereau(instruction?.processTypeId);
  const faBorderProcessType = isBordereau || isFeeAndAmendment;
  const riskReferences = instruction?.riskReferences;
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
  const producingBrokers = utils.generic.isValidArray(gxbProducingBrokers, true) ? gxbProducingBrokers : producingBrokersFromRoles;
  const accountExecutives = utils.generic.isValidArray(gxbAccountExecutives, true) ? gxbAccountExecutives : accountExecutivesFromRoles;

  const getFacilityTypeId = () => {
    let facilityTypeId = instruction?.details?.facilityTypeId;

    if (!facilityTypeId && utils.generic.isValidArray(facilityTypes, true)) {
      const item = facilityTypes.find((type) => type.facilityTypeID === instruction?.details?.facilityTypeId);
      facilityTypeId = item?.facilityTypeID;
    }

    return facilityTypeId || '';
  };

  const getRiskReferenceDocumentCount = () => {
    if (utils.generic.isValidArray(documents?.riskReferences, true)) {
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
      dispatch(getRiskReferenceDocumentsCount(referenceList, documentTypeValue));
    }
  };

  useEffect(() => {
    getRiskReferenceDocumentCount();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const getSelectedProducingBrokerName = (pbId) => {
    const selectedProducingBrokerName = producingBrokers?.find((pb) => pb?.name === pbId)?.name; // Will replace pb?.name with pb?.id once api send id information
    return selectedProducingBrokerName;
  };

  // TODO
  // const getSelectedProducingBrokerEmail = (pbId) => {
  //   const selectedProducingBrokerEmail = producingBrokers?.find((pb) => pb?.id === pbId)?.emailId;
  //   return selectedProducingBrokerEmail;
  // };

  const getSelectedAccountExecutiveName = (aeId) => {
    const selectedAccountExecutiveName = accountExecutives?.find((ae) => ae?.name === aeId)?.name; // Will replace ae?.name with ae?.id once api send id information
    return selectedAccountExecutiveName;
  };
  // TODO
  // const getSelectedAccountExecutiveEmail = (aeId) => {
  //   const selectedAccountExecutiveEmail = accountExecutives?.find((ae) => ae?.id === aeId)?.emailId;
  //   return selectedAccountExecutiveEmail;
  // };

  const fields = [
    {
      name: 'invoicingClient',
      group: 'general',
      type: 'text',
      label: utils.string.t('processingInstructions.checklist.fields.invoicingClient'),
      value: leadRef?.clientName || '',
      muiComponentProps: {
        InputProps: {
          readOnly: true,
          disabled: true,
        },
      },
    },
    {
      name: 'contactName',
      group: 'general',
      type: 'text',
      label: utils.string.t('processingInstructions.checklist.fields.contactName'),
      value: instruction?.details?.contactName || '',
      validation: Yup.string().required(utils.string.t('validation.required')),
      muiComponentProps: {
        inputProps: {
          maxLength: 50,
        },
        InputProps: {
          readOnly: isReadOnly,
          disabled: isReadOnly,
        },
      },
    },
    {
      name: 'clientEmail',
      group: 'general',
      type: 'text',
      label: utils.string.t('processingInstructions.checklist.fields.clientEmail'),
      value: instruction?.details?.clientEmail || '',
      validation: Yup.string().email(utils.string.t('validation.email')).required(utils.string.t('validation.required')),
      muiComponentProps: {
        inputProps: {
          maxLength: 50,
        },
        InputProps: {
          readOnly: isReadOnly,
          disabled: isReadOnly,
        },
      },
    },
    {
      name: 'eocInvoiceContactName',
      group: 'general',
      type: 'text',
      label: utils.string.t('processingInstructions.checklist.fields.eocInvoiceContactName'),
      value: instruction?.details?.eocInvoiceContactName || '',
      muiComponentProps: {
        inputProps: {
          maxLength: 50,
        },
        InputProps: {
          readOnly: isReadOnly,
          disabled: isReadOnly,
        },
      },
    },
    {
      name: 'eocInvoiceMail',
      group: 'general',
      type: 'text',
      label: utils.string.t('processingInstructions.checklist.fields.eocInvoiceMail'),
      validation: Yup.string().email(utils.string.t('validation.email')),
      value: instruction?.details?.eocInvoiceMail || '',
      muiComponentProps: {
        inputProps: {
          maxLength: 50,
        },
        InputProps: {
          readOnly: isReadOnly,
          disabled: isReadOnly,
        },
      },
    },
    {
      name: 'producingBroker',
      group: 'general',
      type: 'select',
      label: utils.string.t('processingInstructions.checklist.fields.producingBroker'),
      value: instruction?.details?.producingBrokerName || leadRefProducingBrokerFirstGXBValue?.name || '',
      options: producingBrokers,
      optionKey: 'name', // Will update it with 'id' once api send id details
      optionLabel: 'name',
      validation: Yup.string().required(utils.string.t('validation.required')),
      muiComponentProps: {
        disabled: isReadOnly || utils.generic.isInvalidOrEmptyArray(producingBrokers),
      },
    },
    {
      name: 'accountExecutive',
      group: 'general',
      type: 'select',
      label: utils.string.t('processingInstructions.checklist.fields.accountExecutive'),
      value: instruction?.details?.accountExecutive || leadRefAccountExecutiveFirstGXBValue?.name || '',
      options: accountExecutives,
      optionKey: 'name', // Will update it with 'id' once api send id details
      optionLabel: 'name',
      validation: Yup.string().required(utils.string.t('validation.required')),
      muiComponentProps: {
        disabled: isReadOnly || utils.generic.isInvalidOrEmptyArray(accountExecutives),
      },
    },
    ...(isFdo
      ? [
          {
            name: 'businessType',
            group: 'general',
            type: 'text',
            label: utils.string.t('processingInstructions.checklist.fields.businessType'),
            value: leadRef?.businessType || '',
            muiComponentProps: {
              InputProps: {
                readOnly: true,
                disabled: true,
              },
            },
          },
          {
            name: 'facilityType',
            group: 'general',
            type: 'select',
            label: utils.string.t('processingInstructions.checklist.fields.facilityType'),
            value: getFacilityTypeId(),
            validation: Yup.string().required(utils.string.t('validation.required')),
            options: facilityTypes,
            optionKey: 'facilityTypeID',
            optionLabel: 'facilityTypeDetails',
            disabled: isReadOnly || utils.generic.isInvalidOrEmptyArray(facilityTypes),
          },
        ]
      : []),
  ];

  useEffect(
    () => {
      const reset = childRef?.current?.props?.resetFunc;
      const schema = utils.schemas.parsePiChecklist(piSchema, instruction);
      const updatedDefaultValues = {
        checklist: utils.form.getNestedInitialValues(schema?.rows, 'columnName'),
        ...utils.form.getInitialValues(fields),
      };

      setSchemaData(schema);
      setDefaultValues(updatedDefaultValues);

      if (utils.generic.isFunction(reset)) {
        reset(updatedDefaultValues, {
          keepDirty: false,
        });
      }
    },
    [instruction] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const validateChecklistDates = (valuesChecklist) => {
    if (valuesChecklist?.quotesPutUp?.accountHandler === 'YES' && valuesChecklist?.quotesPutUp?.signedDate === null) {
      return false;
    }

    if (valuesChecklist?.dutyOfDisclosure?.accountHandler === 'YES' && valuesChecklist?.dutyOfDisclosure?.signedDate === null) {
      return false;
    }

    if (valuesChecklist?.dateOfOrder?.accountHandler === 'YES' && valuesChecklist?.dateOfOrder?.signedDate === null) {
      return false;
    }

    return true;
  };

  const validateYesNoNaToggle = (valuesChecklist) => {
    return Object.values(valuesChecklist).every((c) => ['YES', 'NO', 'NA'].includes(c.accountHandler));
  };

  const validateChecklistTabs = (valuesChecklist) => {
    return validateYesNoNaToggle(valuesChecklist) && validateChecklistDates(valuesChecklist);
  };

  const validateAllChecklistSelected = (valuesChecklist) => {
    return validateYesNoNaToggle(valuesChecklist);
  };

  const validateMandateChecklistDates = (checklistRow) => {
    if (checklistRow?.accountHandler === 'YES' && checklistRow?.signedDate === null) {
      return true;
    }
    return false;
  };

  const saveChecklist = ({ isNext, isSave, isSaveNext }) => {
    const formValues = childRef.current.props?.values;
    const updatedInstruction = {
      ...instruction,
      details: {
        ...instruction.details,
        ...(formValues?.accountExecutive && {
          accountExecutive: getSelectedAccountExecutiveName(formValues?.accountExecutive),
          // TODO
          // accountExecutiveId: formValues?.accountExecutive,
          // accountExecutiveEmailId: getSelectedAccountExecutiveEmail(formValues?.accountExecutive),
        }),
        ...(formValues?.producingBroker && {
          producingBrokerName: getSelectedProducingBrokerName(formValues?.producingBroker),
          // TODO
          // producingBrokerId: formValues?.producingBroker,
          // producingBrokerEmailId: getSelectedProducingBrokerEmail(formValues?.producingBroker),
        }),
      },
    };

    if (isSaveNext || isSave) {
      dispatch(checkListUpdate(formValues, updatedInstruction)).then((data) => {
        if (isSaveNext) {
          if (data?.status === constants.API_RESPONSE_OK) {
            handlers.next();
          } else {
            dispatch(enqueueNotification('app.somethingWentWrong', 'warning'));
          }
        }
      });
    } else if (isNext) {
      handlers.next();
    }
  };

  const handleSave = (type) => {
    saveChecklist(type);
  };

  const handleNext = (generalTabErrors, type) => {
    const formValues = childRef.current.props?.values;
    const isChecklistDatesSelected = validateChecklistDates(formValues?.checklist);

    const updatedContent = Object.entries(piSchema?.content)?.reduce((acc, [key, value]) => {
      const newValue = value?.map((contentValue) => {
        contentValue.cells[0].isError =
          !Boolean(formValues?.checklist[contentValue?.rowKey]?.accountHandler) ||
          (['quotesPutUp', 'dutyOfDisclosure', 'dateOfOrder'].includes(contentValue?.rowKey) &&
            validateMandateChecklistDates(formValues?.checklist[contentValue?.rowKey]));

        return contentValue;
      });

      return {
        ...acc,
        ...{
          [key]: newValue,
        },
      };
    }, {});

    const updatePiSchema = { ...piSchema, content: updatedContent };
    setPiSchema(updatePiSchema);
    const schema = utils.schemas.parsePiChecklist(updatePiSchema, instruction);
    setSchemaData(schema);

    const prePlacingChcklist = Object.entries(formValues?.checklist)?.reduce((acc, [key, value]) => {
      return {
        ...acc,
        ...(['quotesPutUp', 'dutyOfDisclosure', 'demandsNeeds', 'slipsSigned', 'dateOfOrder', 'atlas', 'bars'].includes(key) && {
          [key]: value,
        }),
      };
    }, {});
    const mrcChcklist = Object.entries(formValues?.checklist)?.reduce((acc, [key, value]) => {
      return {
        ...acc,
        ...([
          'allWrittenLines',
          'allUnderwriter',
          'informationClearlyStated',
          'allMarketsApproved',
          'paymentTerms',
          'subscriptionAgreement',
          'riskCodes',
        ].includes(key) && {
          [key]: value,
        }),
      };
    }, {});
    const otherDetailsChcklist = Object.entries(formValues?.checklist)?.reduce((acc, [key, value]) => {
      return {
        ...acc,
        ...(['marketSheet', 'confirmSanctioned', 'thirdParty', 'contractCertainty'].includes(key) && {
          [key]: value,
        }),
      };
    }, {});

    const isChecklistCompleted = validateAllChecklistSelected(formValues?.checklist);
    const isPrePlacingChecklistCompleted = validateChecklistTabs(prePlacingChcklist);
    const isMrcChecklistCompleted = validateChecklistTabs(mrcChcklist);
    const isOtherDetailsChecklistCompleted = validateChecklistTabs(otherDetailsChcklist);
    const isAllRiskRefsHavingAtLeastADoc = !(
      utils.generic.isValidArray(riskReferencesDocumentsCountList, true) &&
      riskReferencesDocumentsCountList?.some((a) => Number(a?.documentCount) === 0)
    );
    const updatedTabs = tabs?.map((tab) => {
      switch (tab.value) {
        case constants.GENERAL:
          return { ...tab, errors: generalTabErrors };
        case constants.PRE_PLACING:
          return { ...tab, errors: Number(!isPrePlacingChecklistCompleted) };
        case constants.MRC:
          return { ...tab, errors: Number(!isMrcChecklistCompleted) };
        case constants.OTHER_DETAILS:
          return { ...tab, errors: Number(!isOtherDetailsChecklistCompleted) };
        case constants.RISK_REFERENCES:
          return { ...tab, errors: Number(!isAllRiskRefsHavingAtLeastADoc) };
        default:
          return {};
      }
    });
    setTabs(updatedTabs);

    const isAllMandatoryFieldsCompleted = !Boolean(generalTabErrors) && isChecklistCompleted;

    if (isAllRiskRefsHavingAtLeastADoc && isAllMandatoryFieldsCompleted && isChecklistDatesSelected) {
      saveChecklist(type);
    } else if (!isAllMandatoryFieldsCompleted && !isAllRiskRefsHavingAtLeastADoc && !isChecklistDatesSelected) {
      dispatch(enqueueNotification('processingInstructions.checklist.missingRequiredFieldsDatesDocs', 'warning'));
    } else if (!isAllRiskRefsHavingAtLeastADoc && !isChecklistDatesSelected) {
      dispatch(enqueueNotification('processingInstructions.checklist.missingRequiredDatesDocs', 'warning'));
    } else if (!isAllMandatoryFieldsCompleted && !isChecklistDatesSelected) {
      dispatch(enqueueNotification('processingInstructions.checklist.missingRequiredFieldsDates', 'warning'));
    } else if (!isAllMandatoryFieldsCompleted && !isAllRiskRefsHavingAtLeastADoc) {
      dispatch(enqueueNotification('processingInstructions.checklist.missingRequiredFieldsDocs', 'warning'));
    } else if (!isAllMandatoryFieldsCompleted) {
      dispatch(enqueueNotification('processingInstructions.checklist.missingRequiredFields', 'warning'));
    } else if (!isAllRiskRefsHavingAtLeastADoc) {
      dispatch(enqueueNotification('processingInstructions.checklist.missingRequiredDocs', 'warning'));
    } else if (!isChecklistDatesSelected) {
      dispatch(enqueueNotification('processingInstructions.checklist.missingRequiredDates', 'warning'));
    }
  };

  const handleCancel = () => {
    const reset = childRef?.current?.props?.resetFunc;

    setResetKey(new Date().getTime());
    setTabs(checklistTabs);

    const updatedContent = Object.entries(piSchema?.content)?.reduce((acc, [key, value]) => {
      const newValue = value?.map((contentValue) => {
        contentValue.cells[0].isError = false;
        return contentValue;
      });

      return {
        ...acc,
        ...{
          [key]: newValue,
        },
      };
    }, {});

    const updatePiSchema = { ...piSchema, content: updatedContent };
    setPiSchema(updatePiSchema);
    const schema = utils.schemas.parsePiChecklist(updatePiSchema, instruction);
    setSchemaData(schema);
    if (utils.generic.isFunction(reset)) {
      reset(defaultValues, { keepDirty: false });
    }
  };

  const toggleTab = (tab) => {
    setSelectedTab(tab);
    history.replace(`${config.routes.processingInstructions.steps}/${id}${step ? `/${step}` : ''}${tab ? `/${tab}` : ''}`);
  };

  // abort if data is not ready/available
  if (!defaultValues || !instruction) return null;

  return (
    <ProcessingInstructionsChecklistView
      instruction={instruction}
      leadRef={leadRef}
      defaultValues={defaultValues}
      columns={columns}
      tabs={tabs}
      selectedTab={selectedTab}
      fields={fields}
      schemaData={schemaData}
      isRiskReferenceDocumentCountLoading={isRiskReferenceDocumentCountLoading}
      isFdo={isFdo}
      isReadOnly={isReadOnly}
      isEditable={isEditable}
      isCheckboxesEditable={isCheckboxesEditable}
      resetKey={resetKey}
      handlers={{
        ...handlers,
        cancel: handleCancel,
        save: handleSave,
        next: handleNext,
        toggleTab,
        setTabs,
      }}
      ref={childRef}
    />
  );
}
