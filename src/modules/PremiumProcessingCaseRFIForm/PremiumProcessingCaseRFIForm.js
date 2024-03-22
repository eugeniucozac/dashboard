import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import PropTypes from 'prop-types';
import moment from 'moment';
import * as Yup from 'yup';
import sortBy from 'lodash/sortBy';
import uniqBy from 'lodash/uniqBy';

// app
import PremiumProcessingCaseRFIFormView from './PremiumProcessingCaseRFIForm.view';
import {
  getRfiResponseDate,
  getViewTableDocuments,
  postSubmitNewRfi,
  premiumProcessingBureauRFIDetails,
  selectRefDataResolutionCode,
  selectCaseIsCheckSigning,
  selectUserDetails,
  selectUserGroup,
  selectorDmsViewFiles,
  selectRefDataQueryCodes,
} from 'stores';
import { useConfirmNavigation } from 'hooks';
import * as constants from 'consts';
import * as utils from 'utils';
import config from 'config';

PremiumProcessingCaseRFIForm.propTypes = {
  caseDetails: PropTypes.object.isRequired,
  rfiDetails: PropTypes.object,
  newRfiUsers: PropTypes.array.isRequired,
  isEditable: PropTypes.bool.isRequired,
  isPageDirty: PropTypes.bool.isRequired,
  isWorklist: PropTypes.bool.isRequired,
  isSeniorManager: PropTypes.bool,
  handlers: PropTypes.shape({
    stayOnTab: PropTypes.func.isRequired,
    switchTab: PropTypes.func.isRequired,
    setIsPageDirty: PropTypes.func.isRequired,
  }),
};

export default function PremiumProcessingCaseRFIForm({
  caseDetails = {},
  rfiDetails,
  newRfiUsers,
  isPageDirty,
  isEditable,
  handlers,
  isWorklist,
  isSeniorManager,
}) {
  const history = useHistory();
  const dispatch = useDispatch();

  const { confirmNavigation } = useConfirmNavigation({
    title: utils.string.t('navigation.form.titleClear'),
    subtitle: utils.string.t('navigation.form.subtitle'),
  });

  const isCheckSigning = useSelector(selectCaseIsCheckSigning);
  const queryCodes = useSelector(selectRefDataQueryCodes);
  const resolutionCodes = useSelector(selectRefDataResolutionCode);
  const currentUser = useSelector(selectUserDetails);
  const userGroup = useSelector(selectUserGroup);
  const dmsViewFiles = useSelector(selectorDmsViewFiles);

  const tabDetails = caseDetails?.taskView === constants.WORKBASKET || caseDetails?.taskView === constants.ALL_CASES;
  const isNotResolvedOrSendToFECValue =
    rfiDetails?.isNotResolvedOrSendToFEC === constants.RESOLVE_SENDTOFEC_YES && rfiDetails?.status === constants.RFI_STATUS.OPEN;
  const [responseDate, setResponseDate] = useState('');
  const [selectedDmsTab, setSelectedDmsTab] = useState(constants.DMS_VIEW_TAB_VIEW);
  const [selectedDmsFiles, setSelectedDmsFiles] = useState([]);

  const isRejectPendingActionStage = caseDetails?.caseStageDetails?.some(
    (cs) => [constants.BPM_STAGE_REJECTED_PENDING_ACTION].includes(cs.bpmStageCode) && cs.active
  );
  if(isRejectPendingActionStage){
    isEditable = false;
  }
  const queryCodesRfi = utils.generic.isValidArray(queryCodes, true)
    ? queryCodes.filter((queryCode) => queryCode.rfiTypeID === constants.RFI_TYPE_FOR_QUERY_CODE)
    : [];

  const { caseTeamData, fecId, caseId, instructionId, policyRef } = caseDetails;
  const queryCodesBureauRfi = utils.generic.isValidArray(queryCodes, true)
    ? queryCodes.filter((queryCode) => queryCode.rfiTypeID === constants.RFI_TYPE_FOR_BUREAU_QUERY_CODE)
    : [];

  const resolutionCodesRfi = utils.generic.isValidArray(resolutionCodes, true)
    ? resolutionCodes.filter((resolutionCodes) => resolutionCodes.rfiTypeID === constants.RFI_TYPE_FOR_BUREAU_RESOLUTION_CODE)
    : [];

  const caseDepartXbInstanceId = `${caseTeamData?.departmentId}-${caseTeamData?.xbInstanceId}`;

  // re-order the list of users
  // move the FEC who created the RFI to the top of the list
  // filter only keep users who match the task departmentID and xbIstanceID
  const users = sortBy(newRfiUsers, (user) => user?.userId !== fecId);
  const usersFiltered = users?.filter((user) => {
    return user && user?.departmentId?.split(', ').includes(caseDepartXbInstanceId);
  });

  useEffect(() => {
    if (caseId) {
      // if RFI is being created, we fetch all case documents
      // if RFI is already created, we only fetch the documents linked to the RFI
      const params = isEditable
        ? {
          referenceId: caseId,
          sectionType: constants.DMS_CONTEXT_CASE,
          instructionId: instructionId,
          policyRef: policyRef,
        }
        : { referenceId: rfiDetails.queryId, sectionType: constants.DMS_CONTEXT_RFI };
      dispatch(getViewTableDocuments(params));
    }
  }, [caseId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (isCheckSigning) {
      dispatch(premiumProcessingBureauRFIDetails(caseId));
    }
  }, [caseId, isCheckSigning]); // eslint-disable-line react-hooks/exhaustive-deps

  const resetForm = (resetFn) => {
    if (utils.generic.isFunction(resetFn)) {
      resetFn(utils.form.getInitialValues(fields), { keepDirty: false });
      setResponseDate('');
    }
  };

  const handleCancel = (resetFn) => {
    if (isPageDirty) {
      confirmNavigation(() => resetForm(resetFn));
    } else {
      resetForm(resetFn);
    }
  };

  const getResponseDate = (option) => {
    dispatch(getRfiResponseDate({ sla: option?.sla })).then((response) => {
      const responseDate = response?.data?.dueDate ? response.data.dueDate : '';
      setResponseDate(responseDate);
    });
  };

  const selectDmsTab = (tabName) => {
    setSelectedDmsTab(tabName);
  };

  const onSelectDmsFile = (files) => {
    setSelectedDmsFiles(uniqBy([...selectedDmsFiles, ...files], 'documentId'));
  };
  const currentUserEmail = currentUser.email;
  const currentUserGroup = userGroup?.[0]?.code;

  const actions = [
    {
      name: 'cancel',
      label: utils.string.t('app.cancel'),
      handler: (reset) => handleCancel(reset),
    },
    {
      name: 'submit',
      label: isCheckSigning ? utils.string.t('premiumProcessing.resolveRfi.resolveRfi') : utils.string.t('premiumProcessing.rfi.sendRFI'),
      handler: (reset) => (values) => {
        handlers.setIsPageDirty(false);

        const internalRFI = {
          caseIncidentId: caseDetails?.caseId,
          parentTaskId: caseDetails?.taskId,
          parentProcessId: caseDetails?.processId,
          assignedTo: values?.sendTo?.emailId,
          assignedToTeam: values?.sendTo?.groupName,
          queryDescription: values?.queryDescription,
          queryCodeDescription: values?.queryCode?.queryCodeDescription,
          ...(responseDate ? { dueDate: moment(responseDate).format('DD-MM-YYYY') } : null),
          queryCode: values?.queryCode?.queryCodeDetails,
          taskCategory: values?.rfiType,
          documentId: selectedDmsFiles?.map((doc) => doc.documentId),
        };

        const bureauRFI = {
          action: values?.chooseAction,
          assignedTo: values?.sendTo?.emailId ? values?.sendTo?.emailId : currentUserEmail,
          assignedToTeam: values?.sendTo?.groupName ? values?.sendTo?.groupName : currentUserGroup,
          bureauNames: caseDetails?.bureauRfiDetails?.bureauName,
          bureauQuery: values?.bureauQueryDescription,
          caseIncidentId: caseDetails?.caseId,
          ...(responseDate ? { dueDate: moment(responseDate).format('DD-MM-YYYY') } : null),
          parentTaskId: caseDetails?.taskId,
          parentProcessId: caseDetails?.processId,
          queryDescription: values?.resolutionNotes ? values?.resolutionNotes : values?.resolutionNotesFEC,
          queryCode: values?.queryCodeBureau?.queryCodeDetails,
          queryCodeDescription: values?.queryCodeBureau?.queryCodeDescription,
          resolutionCode: values?.resolutionCode?.resolutionCd,
          workPackageRef: caseDetails?.bureauRfiDetails?.workPackageReference,
          taskCategory: 'ExternalRFI',
          documentId: selectedDmsFiles?.map((doc) => doc.documentId),
          ...(!isEditable && { rfiId: rfiDetails?.isNotResolvedOrSendToFEC === constants.RESOLVE_SENDTOFEC_YES ? rfiDetails?.taskId : null })
        };

        const payload = isCheckSigning ? bureauRFI : internalRFI;

        dispatch(postSubmitNewRfi(payload)).then((response) => {
          // success POST
          if (response?.status === constants.API_RESPONSE_OK && response?.data?.id) {
            reset(isCheckSigning ? { chooseAction: values.chooseAction } : undefined);
            history.push(config.routes.premiumProcessing.root);
          }
        });
      },
    },
  ];

  const sendToOptions =
    usersFiltered?.map((user) => {
      return { ...user, userNameEmail: `${user.fullName} - ${user.emailId}` };
    }) || [];

  const isRadioButtonValue = rfiDetails.rfiType === constants.BUREAU_RFITYPE && rfiDetails.status === constants.RFI_STATUS.OPEN;

  const fields = [
    {
      name: 'rfiType',
      type: 'radio',
      title: utils.string.t('premiumProcessing.rfi.rfiType'),
      value: isCheckSigning ? 'bureau' : !isEditable ? (rfiDetails?.rfiType === 'Internal' ? 'InternalRFI' : 'bureau') : 'InternalRFI',
      options: [
        {
          name: 'internal',
          value: 'InternalRFI',
          label: utils.string.t('premiumProcessing.rfi.internal'),
        },
        {
          name: 'bureau',
          value: 'bureau',
          label: utils.string.t('premiumProcessing.rfi.bureau'),
        },
      ],
      muiFormGroupProps: {
        row: true,
      },
      muiComponentProps: {
        disabled: true,
      },
    },
    {
      name: 'sendTo',
      type: 'autocompletemui',
      value: !isEditable ? sendToOptions.find((option) => option?.emailId === rfiDetails?.sendTo) || null : null,
      options: sendToOptions,
      muiComponentProps: {
        disabled: (isNotResolvedOrSendToFECValue && !isSeniorManager && !isRejectPendingActionStage) && isWorklist ? false : !isEditable || !isWorklist,
      },
      optionKey: 'userId',
      optionLabel: 'userNameEmail',
      label: utils.string.t('premiumProcessing.rfi.sendToInternalRfi'),
    },
    {
      name: 'queryCode',
      type: 'autocompletemui',
      value: !isEditable ? queryCodesRfi.find((option) => option?.queryCodeDetails === rfiDetails?.queryCode) || null : null,
      options: queryCodesRfi || [],
      optionKey: 'queryCodeID',
      optionLabel: 'queryCodeDescription',
      label: utils.string.t('premiumProcessing.rfi.queryCodeRfiInternal'),
      muiComponentProps: {
        disabled: !isEditable || !isWorklist || isRejectPendingActionStage,
      },
    },
    {
      name: 'queryCodeBureau',
      type: 'autocompletemui',
      value: !isEditable ? queryCodesBureauRfi.find((option) => option?.queryCodeDetails === rfiDetails?.queryCode) || null : null,
      options: queryCodesBureauRfi || [],
      optionKey: 'queryCodeID',
      optionLabel: 'queryCodeDescription',
      label: utils.string.t('premiumProcessing.rfi.queryCodeRfiBureau'),
      muiComponentProps: {
        disabled: (isNotResolvedOrSendToFECValue && !isSeniorManager && !isRejectPendingActionStage) && isWorklist ? false : !isWorklist || !isEditable || isRejectPendingActionStage,
      },
    },
    {
      name: 'responseDate',
      type: 'text',
      value: responseDate,
      label: utils.string.t('premiumProcessing.rfi.expectedResponseDate'),
      muiComponentProps: {
        disabled: !isEditable || !isWorklist,
        InputProps: {
          readOnly: true,
          disabled: true,
        },
      },
    },

    {
      name: 'chooseAction',
      type: 'radio',
      title: utils.string.t('premiumProcessing.rfi.chooseAction'),
      value: isRadioButtonValue && !isEditable ? 'Send to FEC' : 'Resolve',
      options: [
        {
          name: 'resolve',
          value: 'Resolve',
          label: utils.string.t('premiumProcessing.rfi.resolve'),
          disabled: (isNotResolvedOrSendToFECValue && !isSeniorManager && !isRejectPendingActionStage) && isWorklist ? false : !isWorklist || !isEditable || isRejectPendingActionStage,
        },
        {
          name: 'sendtoFEC',
          value: 'Send to FEC',
          label: utils.string.t('premiumProcessing.rfi.sendToFec'),
          disabled: (isNotResolvedOrSendToFECValue && !isSeniorManager && !isRejectPendingActionStage) && isWorklist ? false : !isWorklist || !isEditable || isRejectPendingActionStage,
        },
      ],
      muiFormGroupProps: {
        row: true,
      },
    },
    {
      name: 'bureauQueryDescription',
      type: 'textarea',
      label: utils.string.t('premiumProcessing.rfi.bureauQuery'),
      placeholder: utils.string.t('premiumProcessing.rfi.queryPlaceholder'),
      value: !isEditable ? rfiDetails?.bureauQuery : '',
      muiComponentProps: {
        inputProps: { maxLength: 5000 },
        multiline: true,
        minRows: 5,
        maxRows: 10,
        disabled: !isWorklist || !isEditable || isRejectPendingActionStage,
      },
      validation: isCheckSigning
        ? Yup.string()
          .min(5, utils.string.t('validation.string.min'))
          .max(4000, utils.string.t('validation.string.max'))
          .required(utils.string.t('validation.required'))
        : '',
    },
    {
      name: 'resolutionNotes',
      type: 'textarea',
      label: utils.string.t('premiumProcessing.notes.notes'),
      placeholder: utils.string.t('premiumProcessing.rfi.queryPlaceholder'),
      value: !isEditable ? rfiDetails?.notes || '' : '',
      muiComponentProps: {
        inputProps: { maxLength: 4000 },
        multiline: true,
        minRows: 5,
        maxRows: 10,
        disabled: (isNotResolvedOrSendToFECValue && !isSeniorManager && !isRejectPendingActionStage) && isWorklist ? false : !isWorklist || !isEditable || isRejectPendingActionStage,
      },
      validation: isCheckSigning
        ? Yup.string().min(5, utils.string.t('validation.string.min')).max(4000, utils.string.t('validation.string.max'))
        : '',
    },
    {
      name: 'resolutionNotesFEC',
      type: 'textarea',
      label: utils.string.t('premiumProcessing.rfi.queryLabelForCheckSigning'),
      placeholder: utils.string.t('premiumProcessing.rfi.queryPlaceholder'),
      value: !isEditable ? rfiDetails?.notes || '' : '',
      muiComponentProps: {
        inputProps: { maxLength: 4000 },
        multiline: true,
        minRows: 5,
        maxRows: 10,
        disabled: (isNotResolvedOrSendToFECValue && !isSeniorManager && !isRejectPendingActionStage) && isWorklist ? false : !isWorklist || !isEditable,
      },
      validation: isCheckSigning
        ? Yup.string().min(5, utils.string.t('validation.string.min')).max(4000, utils.string.t('validation.string.max'))
        : '',
    },
    {
      name: 'bureauQuery',
      type: 'textarea',
      label: utils.string.t('premiumProcessing.rfi.queryLabelForCheckSigning'),
      placeholder: utils.string.t('premiumProcessing.rfi.queryPlaceholder'),
      value: '',
      muiComponentProps: {
        inputProps: { maxLength: 4000 },
        multiline: true,
        minRows: 5,
        maxRows: 10,
        disabled: !isEditable,
      },
      validation: isCheckSigning
        ? Yup.string().min(5, utils.string.t('validation.string.min')).max(4000, utils.string.t('validation.string.max'))
        : '',
    },
    {
      name: 'resolutionCode',
      type: 'autocompletemui',
      value: !isEditable ? resolutionCodesRfi.find((option) => option?.resolutionCd === rfiDetails?.resolutionCode) || null : null,
      options: resolutionCodesRfi || [],
      optionKey: 'resolutionCodeID',
      optionLabel: 'resolutionCodeDescription',
      label: utils.string.t('premiumProcessing.rfi.resolutionCode'),
      muiComponentProps: {
        disabled: (isNotResolvedOrSendToFECValue && !isSeniorManager && !isRejectPendingActionStage) && isWorklist ? false : !isWorklist || !isEditable || isRejectPendingActionStage,
      },
    },
    {
      name: 'queryDescription',
      type: 'textarea',
      label: utils.string.t('premiumProcessing.rfi.queryLabel'),
      placeholder: utils.string.t('premiumProcessing.rfi.queryPlaceholder'),
      value: !isEditable ? rfiDetails?.notes || '' : '',
      muiComponentProps: {
        disabled: !isEditable || !isWorklist,
        inputProps: { maxLength: 4000 },
        multiline: true,
        minRows: 5,
        maxRows: 10,
      },
      validation: !isCheckSigning
        ? Yup.string()
          .min(5, utils.string.t('validation.string.min'))
          .max(4000, utils.string.t('validation.string.max'))
          .required(utils.string.t('validation.required'))
        : '',
    },
  ];

  const dms = {
    context: constants.DMS_CONTEXT_CASE,
    referenceId: caseId?.toString(), // confirm with API which ID should be used for reference
    sourceId: caseTeamData?.xbInstanceId,
  };

  const tabs = [
    {
      value: constants.DMS_VIEW_TAB_VIEW,
      label: utils.string.t('dms.wrapper.tabs.viewDocuments'),
      disabled: !isWorklist,
    },
  ];

  // abort
  if (utils.generic.isInvalidOrEmptyArray(sendToOptions)) {
    return null;
  }

  return (
    <PremiumProcessingCaseRFIFormView
      isWorklist={isWorklist}
      tabDetails={tabDetails}
      key={!isEditable ? rfiDetails?.taskId : 'new'}
      fields={fields}
      actions={actions}
      caseDetails={caseDetails}
      dms={dms}
      dmsTabs={tabs}
      documents={dmsViewFiles}
      selectedDmsTab={selectedDmsTab}
      isCheckSigning={isCheckSigning}
      isEditable={isEditable}
      isPageDirty={isPageDirty}
      isSeniorManager={isSeniorManager}
      isNotResolvedOrSendToFECValue={isNotResolvedOrSendToFECValue}
      isRejectPendingActionStage={isRejectPendingActionStage}
      handlers={{ ...handlers, getResponseDate, selectDmsTab, onSelectDmsFile }}
    />
  );
}
