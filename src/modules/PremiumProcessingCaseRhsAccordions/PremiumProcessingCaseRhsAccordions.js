import React from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router';
import isEmpty from 'lodash/isEmpty';
import * as Yup from 'yup';

//app
import PremiumProcessingCaseRhsAccordionsView from './PremiumProcessingCaseRhsAccordions.view';
import {
  enqueueNotification,
  showModal,
  selectCasesListType,
  postNewWorkflowStage,
  getPremiumProcessingTasksDetails,
  selectCaseDetails,
  premiumProcessingCheckSigningCompleteCase,
  premiumProcessingCheckSigningCancelCase,
  selectCaseTaskTypeView,
  getEmailSendStatus,
  selectUserGroup,
} from 'stores';
import * as constants from 'consts';
import * as utils from 'utils';
import config from 'config';

PremiumProcessingCaseRhsAccordions.propTypes = {
  currentUser: PropTypes.array.isRequired,
  selectedCases: PropTypes.array,
  caseRfiDetails: PropTypes.object.isRequired,
  isAllCases: PropTypes.bool.isRequired,
  isCheckSigningCase: PropTypes.bool.isRequired,
  isIssueDocumentStage: PropTypes.bool.isRequired,
  isTransactionCommited: PropTypes.bool.isRequired,
  isUnassignedStage: PropTypes.bool.isRequired,
  isWorkBasket: PropTypes.bool.isRequired,
  handlers: PropTypes.shape({
    caseTeamHandler: PropTypes.func.isRequired,
    caseRfiHandler: PropTypes.func.isRequired,
    openUpdatingPopup: PropTypes.func.isRequired,
  }).isRequired,
};

export default function PremiumProcessingCaseRhsAccordions({
  currentUser,
  selectedCases,
  caseRfiDetails,
  isAllCases,
  isCheckSigningCase,
  isIssueDocumentStage,
  isTransactionCommited,
  isUnassignedStage,
  isWorkBasket,
  handlers,
}) {
  const caseType = useSelector(selectCasesListType);
  const history = useHistory();
  const dispatch = useDispatch();
  const caseDetails = useSelector(selectCaseDetails);
  const caseTaskTypeView = useSelector(selectCaseTaskTypeView);
  const userGroup = useSelector(selectUserGroup);
  const caseStages = caseDetails?.caseStageDetails;
  const selectedCaseDetails = caseDetails?.caseTeamData;
  const policyRef = selectedCases?.[0]?.policyRef;
  const { caseId, taskId, processId, policyId, openRfi } = caseDetails;
  const sourceId = selectedCaseDetails?.xbInstanceId;
  const isBackOffice = utils.generic.isValidArray(userGroup, true) && userGroup[0].code === constants.BACK_OFFICE;
  const isJuniorTechnician =
    utils.generic.isValidArray(currentUser, true) && currentUser.some((item) => [constants.JUNIOR_TECHNICIAN].includes(item.name));
  const isFdo = utils.generic.isValidObject(selectedCaseDetails, 'processName') && selectedCaseDetails?.processName === constants.FDO;
  const isEndorsementNonPremium =
    utils.generic.isValidObject(selectedCaseDetails, 'processName') &&
    selectedCaseDetails?.processName === constants.ENDORSEMENT_NON_PREMIUM;
  const isPppOrPbpStage = caseStages?.some(
    (cs) =>
      [constants.BPM_STAGE_PREPARE_PREMIUM_PROCESSING, constants.BPM_STAGE_PREPARE_BORDEREAU_PROCESSING].includes(cs.bpmStageCode) &&
      cs.active
  );
  const isQueriedStage = caseStages?.some((cs) => [constants.BPM_STAGE_QUERIED].includes(cs.bpmStageCode) && cs.active);
  const isRejectPendingActionStage = caseStages?.some(
    (cs) => [constants.BPM_STAGE_REJECTED_PENDING_ACTION].includes(cs.bpmStageCode) && cs.active
  );
  const qcTypes = [
    {
      id: 1,
      name: 'yes',
      value: 'yes',
      label: utils.string.t('premiumProcessing.qualityControl.pass'),
    },
    {
      id: 2,
      name: 'no',
      value: 'no',
      label: utils.string.t('premiumProcessing.qualityControl.fail'),
    },
  ];
  const viewMoreNotesHandler = () => {
    if (taskId) {
      history.push(`${config.routes.premiumProcessing.case}/${taskId}/${constants.PREMIUM_PROCESSING_TAB_NOTES}`);
    } else if (processId) {
      history.push(`${config.routes.premiumProcessing.case}/${processId}/${constants.PREMIUM_PROCESSING_TAB_NOTES}`);
    }
  };

  let fields = [
    {
      name: 'qcComplete',
      type: 'checkbox',
      value: false,
      label: 'QC complete',
    },
    {
      name: 'notesField',
      type: 'textarea',
      value: '',
      validation: Yup.string().required(),
      muiComponentProps: {
        multiline: true,
        minRows: 3,
        maxRows: 6,
        disabled: isWorkBasket || isAllCases || isUnassignedStage,
        inputProps: {
          maxLength: 2000,
        },
      },
    },
    {
      name: 'qualityControl',
      type: 'radio',
      title: 'Quality Control',
      value: '',
      options: qcTypes,
      muiFormGroupProps: {
        row: true,
      },
      muiComponentProps: {
        disabled: false,
      },
    },
    ...(isTransactionCommited
      ? [
          {
            name: 'transactionCommited',
            type: 'checkbox',
            value: false,
            label: utils.string.t('premiumProcessing.caseDetailsSection.transactionCommit.label'),
          },
        ]
      : []),
  ];

  const showQcModal = (qcValue) => {
    dispatch(
      showModal({
        component: 'CONFIRM',
        props: {
          fullWidth: true,
          title: utils.string.t('premiumProcessing.qualityControlLabel'),
          maxWidth: 'xs',
          componentProps: {
            confirmLabel: utils.string.t('app.submit'),
            cancelLabel: utils.string.t('app.close'),
            confirmMessage:
              qcValue?.qualityControl === 'yes'
                ? utils.string.t('premiumProcessing.qualityControl.qualityControlMoveToNextConfimMessagePass')
                : utils.string.t('premiumProcessing.qualityControl.qualityControlMoveToNextConfimMessageFail'),
            buttonColors: { confirm: 'secondary', cancel: 'primary' },
            submitHandler: () => {
              const isQcApproved = qcValue?.qualityControl;
              const notes = qcValue?.notesField;
              dispatch(postNewWorkflowStage({ taskId, notes, isQcApproved, policyRef })).then((response) => {
                if (response?.message !== null) {
                  if (response?.message.toUpperCase() === constants.API_RESPONSE_SUCCESS) {
                    dispatch(getPremiumProcessingTasksDetails({ requestType: 'search', taskType: caseTaskTypeView, filterTerm: [] }));
                    dispatch(getPremiumProcessingTasksDetails({ requestType: 'filter', taskType: caseTaskTypeView, filterTerm: [] }));
                  }
                } else {
                  dispatch(enqueueNotification(utils.string.t('premiumProcessing.caseDetailsSection.workflowStageUpdateError'), 'error'));
                }
              });
            },
            cancelHandler: () => {},
            handleClose: () => {},
          },
        },
      })
    );
  };
  const handleQcSubmit = (qcValue) => {
    if (!isEmpty(qcValue?.qualityControl)) {
      if (qcValue?.qualityControl === 'yes') {
      } else {
        if (isEmpty(qcValue?.notesField)) {
          dispatch(enqueueNotification('premiumProcessing.qualityControl.qualityControlFailNotesMandatory', 'warning'));
          return;
        }
      }
      showQcModal(qcValue);
    } else {
      dispatch(enqueueNotification('premiumProcessing.qualityControl.qualityControlNotSelected', 'warning'));
    }
  };
  const notesTextFieldProps = {
    fullWidth: true,
    id: 'premium-processing-case-notes',
    margin: 'normal',
    placeholder: '',
    variant: 'outlined',
  };
  const confirmMoveToNextStageModal = () => {
    dispatch(
      showModal({
        component: 'CONFIRM',
        props: {
          fullWidth: true,
          title: utils.string.t('premiumProcessing.qualityControlLabel'),
          maxWidth: 'xs',
          componentProps: {
            confirmLabel: utils.string.t('app.submit'),
            cancelLabel: utils.string.t('app.close'),
            confirmMessage: utils.string.t('premiumProcessing.qualityControlMoveToNextConfimMessage'),
            buttonColors: { confirm: 'secondary', cancel: 'primary' },
            submitHandler: () => {
              dispatch(postNewWorkflowStage({ taskId, policyRef })).then((response) => {
                if (response?.message?.toUpperCase() === constants.API_RESPONSE_SUCCESS) {
                  dispatch(getPremiumProcessingTasksDetails({ requestType: 'search', taskType: caseTaskTypeView, filterTerm: [] }));
                  dispatch(getPremiumProcessingTasksDetails({ requestType: 'filter', taskType: caseTaskTypeView, filterTerm: [] }));
                } else {
                  dispatch(enqueueNotification(utils.string.t('premiumProcessing.caseDetailsSection.workflowStageUpdateError'), 'error'));
                }
              });
            },
            cancelHandler: () => {},
            handleClose: () => {},
          },
        },
      })
    );
  };

  const moveToNextStageApiCall = () => {
    dispatch(postNewWorkflowStage({ taskId, policyRef })).then((response) => {
      if (response?.message && response?.message.toUpperCase() === constants.API_RESPONSE_SUCCESS) {
        dispatch(getPremiumProcessingTasksDetails({ requestType: 'search', taskType: caseTaskTypeView, filterTerm: [] }));
        dispatch(getPremiumProcessingTasksDetails({ requestType: 'filter', taskType: caseTaskTypeView, filterTerm: [] }));
      }
    });
  };

  const confirmMoveToCompletedModal = () => {
    dispatch(
      showModal({
        component: 'CONFIRM',
        props: {
          fullWidth: true,
          title: utils.string.t('premiumProcessing.warning.title'),
          maxWidth: 'xs',
          componentProps: {
            confirmLabel: utils.string.t('premiumProcessing.skipAndProceedButton'),
            cancelLabel: utils.string.t('premiumProcessing.issueDocuments.cancel'),
            confirmMessage: utils.string.t('premiumProcessing.issueDocuments.issueDocumentMoveToNextConfimMessage'),
            buttonColors: { confirm: 'secondary', cancel: 'primary' },
            submitHandler: moveToNextStageApiCall,
            cancelHandler: () => {},
            handleClose: () => {},
          },
        },
      })
    );
  };
  const caseCompletionRfiModal = () => {
    dispatch(
      showModal({
        component: 'CONFIRM',
        props: {
          fullWidth: true,
          title: utils.string.t('premiumProcessing.caseCompletionRfi.caseCompletionRfiLabel'),
          maxWidth: 'xs',
          componentProps: {
            confirmLabel: utils.string.t('premiumProcessing.caseCompletionRfi.caseCompletionRfiButton'),
            cancelLabel: utils.string.t('premiumProcessing.caseCompletionRfi.cancel'),
            confirmMessage: utils.string.t('premiumProcessing.caseCompletionRfi.errorMessage'),
            buttonColors: { confirm: 'secondary', cancel: 'primary' },
            submitHandler: checkIssueDocumentCompleteModal,
            cancelHandler: () => {},
            handleClose: () => {},
          },
        },
      })
    );
  };
  const checkIssueDocumentCompleteModal = () => {
    dispatch(getEmailSendStatus({ caseId, policyId, sourceId })).then((response) => {
      if (response.status === constants.API_RESPONSE_OK) {
        if (response?.data?.emailSentStatus) {
          confirmMoveToCompletedModal();
        } else {
          moveToNextStageApiCall();
        }
      }
    });
  };
  const handleMoveToNextStage = () => {
    if (!(isEndorsementNonPremium || isFdo) && isJuniorTechnician && isPppOrPbpStage) {
      confirmMoveToNextStageModal();
    } else if (isIssueDocumentStage) {
      openRfi && isBackOffice ? caseCompletionRfiModal() : checkIssueDocumentCompleteModal();
    } else {
      if (utils.generic.isValidArray(selectedCases, true)) {
        moveToNextStageApiCall();
      }
    }
  };

  const checkSigningComplete = (fieldsValue) => {
    if (isQueriedStage && openRfi) {
      if (isEmpty(fieldsValue?.notesField)) {
        dispatch(enqueueNotification('premiumProcessing.checkSigningCase.notesMandatoryComplete', 'warning'));
        return;
      }
      caseRfiCompleteBureauModal(fieldsValue?.notesField);
    } else {
      checkSigningCompleteModal(fieldsValue?.notesField);
    }
  };

  const checkSigningCancel = (fieldsValue) => {
    if (isQueriedStage && openRfi) {
      if (isEmpty(fieldsValue?.notesField)) {
        dispatch(enqueueNotification('premiumProcessing.checkSigningCase.notesMandatoryCancel', 'warning'));
        return;
      }
      caseRfiCancelBureauModal(fieldsValue?.notesField);
    } else {
      checkSigningCancelModal(fieldsValue?.notesField);
    }
  };

  const checkSigningReject = (fieldsValue) => {
    if (isQueriedStage && openRfi) {
      if (isEmpty(fieldsValue?.notesField)) {
        dispatch(enqueueNotification('premiumProcessing.checkSigningCase.notesMandatoryReject', 'warning'));
        return;
      }
      caseRfiRejectBureauModal(fieldsValue?.notesField);
    } else {
      checkSigningRejectModal(fieldsValue?.notesField);
    }
  };

  const checkSigningCompleteModal = (notesField) => {
    dispatch(
      showModal({
        component: 'CONFIRM',
        props: {
          fullWidth: true,
          title: utils.string.t('premiumProcessing.checkSigningComplete.popLabel'),
          maxWidth: 'xs',
          componentProps: {
            confirmLabel: utils.string.t('premiumProcessing.checkSigningCase.complete'),
            cancelLabel: utils.string.t('premiumProcessing.checkSigningCase.cancel'),
            confirmMessage: utils.string.t('premiumProcessing.checkSigningComplete.popMessage'),
            buttonColors: { confirm: 'secondary', cancel: 'primary' },
            submitHandler: () => {
              dispatch(premiumProcessingCheckSigningCompleteCase({ caseId, notesField })).then((response) => {
                if (response?.message?.toUpperCase() === constants.API_RESPONSE_SUCCESS) {
                  dispatch(getPremiumProcessingTasksDetails({ requestType: 'search', taskType: caseTaskTypeView, filterTerm: [] }));
                  dispatch(getPremiumProcessingTasksDetails({ requestType: 'filter', taskType: caseTaskTypeView, filterTerm: [] }));
                } else {
                  dispatch(enqueueNotification(utils.string.t('premiumProcessing.caseDetailsSection.workflowStageUpdateError'), 'error'));
                }
              });
            },
            cancelHandler: () => {},
            handleClose: () => {},
          },
        },
      })
    );
  };

  const caseRfiCompleteBureauModal = (notesField) => {
    dispatch(
      showModal({
        component: 'CONFIRM',
        props: {
          fullWidth: true,
          title: utils.string.t('premiumProcessing.caseCompletionRfi.caseCompletionRfiLabel'),
          maxWidth: 'xs',
          componentProps: {
            confirmLabel: utils.string.t('premiumProcessing.caseCompletionRfi.caseCompletionRfiButton'),
            cancelLabel: utils.string.t('premiumProcessing.caseCompletionRfi.cancel'),
            confirmMessage: utils.string.t('premiumProcessing.caseCompletionRfi.errorMessage'),
            buttonColors: { confirm: 'secondary', cancel: 'primary' },
            submitHandler: () => {
              dispatch(premiumProcessingCheckSigningCompleteCase({ caseId, notesField })).then((response) => {
                if (response?.message?.toUpperCase() === constants.API_RESPONSE_SUCCESS) {
                  dispatch(getPremiumProcessingTasksDetails({ requestType: 'search', taskType: caseTaskTypeView, filterTerm: [] }));
                  dispatch(getPremiumProcessingTasksDetails({ requestType: 'filter', taskType: caseTaskTypeView, filterTerm: [] }));
                } else {
                  dispatch(enqueueNotification(utils.string.t('premiumProcessing.caseDetailsSection.workflowStageUpdateError'), 'error'));
                }
              });
            },
            cancelHandler: () => {},
            handleClose: () => {},
          },
        },
      })
    );
  };

  const checkSigningCancelModal = (notesField) => {
    dispatch(
      showModal({
        component: 'CONFIRM',
        props: {
          fullWidth: true,
          title: utils.string.t('premiumProcessing.checkSigningCancel.popLabel'),
          maxWidth: 'xs',
          componentProps: {
            confirmLabel: utils.string.t('premiumProcessing.checkSigningCancel.continue'),
            cancelLabel: utils.string.t('premiumProcessing.checkSigningCancel.cancel'),
            confirmMessage: utils.string.t('premiumProcessing.checkSigningCancel.popMessage'),
            buttonColors: { confirm: 'secondary', cancel: 'primary' },
            submitHandler: () => {
              dispatch(premiumProcessingCheckSigningCancelCase({ caseId, notesField })).then((response) => {
                if (response?.status?.toLowerCase() === constants.API_RESPONSE_OK.toLowerCase()) {
                  dispatch(getPremiumProcessingTasksDetails({ requestType: 'search', taskType: caseTaskTypeView, filterTerm: [] }));
                  dispatch(getPremiumProcessingTasksDetails({ requestType: 'filter', taskType: caseTaskTypeView, filterTerm: [] }));
                } else {
                  dispatch(enqueueNotification(utils.string.t('premiumProcessing.caseDetailsSection.workflowStageUpdateError'), 'error'));
                }
              });
            },
            cancelHandler: () => {},
            handleClose: () => {},
          },
        },
      })
    );
  };

  const caseRfiCancelBureauModal = (notesField) => {
    dispatch(
      showModal({
        component: 'CONFIRM',
        props: {
          fullWidth: true,
          title: utils.string.t('premiumProcessing.caseCompletionRfi.caseCompletionRfiLabel'),
          maxWidth: 'xs',
          componentProps: {
            confirmLabel: utils.string.t('premiumProcessing.caseCompletionRfi.caseCompletionRfiButton'),
            cancelLabel: utils.string.t('premiumProcessing.caseCompletionRfi.cancel'),
            confirmMessage: utils.string.t('premiumProcessing.caseCompletionRfi.errorMessage'),
            buttonColors: { confirm: 'secondary', cancel: 'primary' },
            submitHandler: () => {
              dispatch(premiumProcessingCheckSigningCancelCase({ caseId, notesField })).then((response) => {
                if (response?.status?.toLowerCase() === constants.API_RESPONSE_OK.toLowerCase()) {
                  dispatch(getPremiumProcessingTasksDetails({ requestType: 'search', taskType: caseTaskTypeView, filterTerm: [] }));
                  dispatch(getPremiumProcessingTasksDetails({ requestType: 'filter', taskType: caseTaskTypeView, filterTerm: [] }));
                } else {
                  dispatch(enqueueNotification(utils.string.t('premiumProcessing.caseDetailsSection.workflowStageUpdateError'), 'error'));
                }
              });
            },
            cancelHandler: () => {},
            handleClose: () => {},
          },
        },
      })
    );
  };

  const checkSigningRejectModal = (fieldsValue) => {
    const notesFieldValue = fieldsValue;
    dispatch(
      showModal({
        component: 'PREMIUM_PROCESSING_CHECK_SIGNING_REJECT',
        props: {
          title: utils.string.t('premiumProcessing.checkSigningReject.popLabel'),
          fullWidth: true,
          maxWidth: 'md',
          componentProps: {
            selectedCases,
            notesFieldValue,
          },
        },
      })
    );
  };

  const caseRfiRejectBureauModal = (notesField) => {
    dispatch(
      showModal({
        component: 'CONFIRM',
        props: {
          fullWidth: true,
          title: utils.string.t('premiumProcessing.caseCompletionRfi.caseCompletionRfiLabel'),
          maxWidth: 'xs',
          componentProps: {
            confirmLabel: utils.string.t('premiumProcessing.caseCompletionRfi.caseCompletionRfiButton'),
            cancelLabel: utils.string.t('premiumProcessing.caseCompletionRfi.cancel'),
            confirmMessage: utils.string.t('premiumProcessing.caseCompletionRfi.errorMessage'),
            buttonColors: { confirm: 'secondary', cancel: 'primary' },
            submitHandler: () => {
              checkSigningRejectModal(notesField);
            },
            cancelHandler: () => {},
            handleClose: () => {},
          },
        },
      })
    );
  };

  return (
    <PremiumProcessingCaseRhsAccordionsView
      isCheckSigningCase={isCheckSigningCase}
      selectedCases={selectedCases}
      currentUser={currentUser}
      caseType={caseType}
      taskId={taskId}
      fields={fields}
      isWorkBasket={isWorkBasket}
      isAllCases={isAllCases}
      isTransactionCommited={isTransactionCommited}
      isUnassignedStage={isUnassignedStage}
      isIssueDocumentStage={isIssueDocumentStage}
      notesTextFieldProps={notesTextFieldProps}
      caseRfiDetails={caseRfiDetails}
      caseTaskTypeView={caseTaskTypeView}
      isRejectPendingActionStage={isRejectPendingActionStage}
      handlers={{
        handleMoveToNextStage: handleMoveToNextStage,
        viewMoreNotesHandler: viewMoreNotesHandler,
        qcSubmit: handleQcSubmit,
        checkSigningComplete: checkSigningComplete,
        checkSigningCancel: checkSigningCancel,
        checkSigningReject: checkSigningReject,
        caseTeamHandler: handlers.caseTeamHandler,
        caseRfiHandler: handlers.caseRfiHandler,
        openUpdatingPopup: handlers.openUpdatingPopup,
      }}
    />
  );
}
