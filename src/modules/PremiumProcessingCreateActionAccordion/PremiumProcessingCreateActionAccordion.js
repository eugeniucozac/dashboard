import React from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';

// app
import PremiumProcessingCreateActionAccordionView from './PremiumProcessingCreateActionAccordion.view';
import config from 'config';
import * as constants from 'consts';
import {
  selectCaseDetails,
  showModal,
  enqueueNotification,
  selectCaseTaskTypeView,
  premiumProcessingRejectCaseInitiation,
  getPremiumProcessingTasksDetails,
  selectCaseIsCheckSigning,
} from 'stores';
import * as utils from 'utils';
import { isEmpty } from 'lodash';

PremiumProcessingCreateActionAccordion.propTypes = {
  taskId: PropTypes.string.isRequired,
  currentUser: PropTypes.array,
  selectedCases: PropTypes.array,
  isUnassignedStage: PropTypes.bool.isRequired,
  fieldsValue: PropTypes.object,
  isWorkBasket: PropTypes.bool.isRequired,
  isAllCases: PropTypes.bool.isRequired,
  isValidRPSection: PropTypes.bool.isRequired,
  isIssueDocumentStage: PropTypes.bool.isRequired,
  isCheckSigningCase: PropTypes.bool.isRequired,
  isRejectPendingActionStage: PropTypes.bool,
};

export default function PremiumProcessingCreateActionAccordion({
  taskId,
  currentUser,
  selectedCases,
  isUnassignedStage,
  fieldsValue,
  isWorkBasket,
  isAllCases,
  isValidRPSection,
  isIssueDocumentStage,
  isCheckSigningCase,
  isRejectPendingActionStage,
}) {
  const dispatch = useDispatch();
  const history = useHistory();
  const caseDetails = useSelector(selectCaseDetails);
  const caseTaskTypeView = useSelector(selectCaseTaskTypeView);
  const isCheckSigning = useSelector(selectCaseIsCheckSigning);
  const caseStages = caseDetails?.caseStageDetails;
  const notesValue = fieldsValue?.notesField;
  const policyRef = selectedCases?.[0]?.policyRef;
  const isCompletedStage = caseStages?.some((cs) => [constants.BPM_STAGE_COMPLETED].includes(cs.bpmStageCode) && cs.active);
  const userRoleRejectCase =
    !isCheckSigning &&
    utils.generic.isValidArray(currentUser, true) &&
    currentUser.some((item) =>
      [
        constants.ROLE_SENIOR_TECHNICIAN.toLowerCase(),
        constants.ROLE_JUNIOR_TECHNICIAN.toLowerCase(),
        constants.ROLE_TECHNICIAN_MANAGER.toLowerCase(),
      ].includes(item.name.toLowerCase())
    );
  const caseId = selectedCases?.[0]?.caseId;
  const caseFlagType = selectedCases?.[0]?.type;
  const selectedCasesType = caseFlagType?.split(',');
  const isQcFlag = Boolean(selectedCasesType?.some((flag) => flag === constants.QC_FLAG));
  const issueDocumentsHandler = () => {
    history.push(
      `${config.routes.premiumProcessing.case}/${taskId}/${constants.PREMIUM_PROCESSING_TAB_ISSUE_DOCUMENTS}/${constants.PREMIUM_PROCESSING_TAB_NON_BUREAU}`
    );
  };

  const newRfiHandler = () => {
    if (taskId) {
      history.push(`${config.routes.premiumProcessing.case}/${taskId}/${constants.PREMIUM_PROCESSING_TAB_RFI}`);
    }
  };

  const manageDocuments = () => {
    if (taskId) {
      history.push(`${config.routes.premiumProcessing.case}/${taskId}/${constants.PREMIUM_PROCESSING_TAB_DOCUMENTS}`);
    }
  };

  const showRejectCaseModal = () => {
    dispatch(
      showModal({
        component: 'CONFIRM',
        props: {
          fullWidth: true,
          title: utils.string.t('premiumProcessing.rejectingCase.rejectCase'),
          maxWidth: 'xs',
          componentProps: {
            confirmLabel: utils.string.t('premiumProcessing.rejectingCase.rejectCase'),
            cancelLabel: utils.string.t('app.cancel'),
            confirmMessage: (
              <span
                dangerouslySetInnerHTML={{
                  __html: `${utils.string.t('premiumProcessing.rejectingCase.rejectCaseConfirmationMessage')}`,
                }}
              />
            ),
            buttonColors: { confirm: 'secondary', cancel: 'primary' },
            submitHandler: () => {
              dispatch(premiumProcessingRejectCaseInitiation({ taskId, notesValue, caseId, policyRef })).then((response) => {
                if (response?.response?.status === constants.API_STATUS_INTERNAL_SERVER_ERROR) {
                  dispatch(enqueueNotification('premiumProcessing.caseDetailsSection.workflowStageUpdateError', 'error'));
                } else {
                  dispatch(getPremiumProcessingTasksDetails({ requestType: 'search', taskType: caseTaskTypeView, filterTerm: [] }));
                  dispatch(getPremiumProcessingTasksDetails({ requestType: 'filter', taskType: caseTaskTypeView, filterTerm: [] }));
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

  const handleRejectCase = () => {
    if (isEmpty(fieldsValue?.notesField)) {
      dispatch(enqueueNotification('premiumProcessing.rejectingCase.rejectCaseNotesMandatoryMessage', 'warning'));
      return;
    }
    showRejectCaseModal();
  };

  const checkSigningHandler = () => {
    dispatch(
      showModal({
        component: 'PREMIUM_PROCESSING_CHECK_SIGNING',
        props: {
          title: utils.string.t('premiumProcessing.checkSigningCase.popUpTitle'),
          fullWidth: true,
          maxWidth: 'md',
          componentProps: {
            caseDetails,
          },
        },
      })
    );
  };

  return (
    <PremiumProcessingCreateActionAccordionView
      taskId={taskId}
      isCompletedStage={isCompletedStage}
      isUnassignedStage={isUnassignedStage}
      isWorkBasket={isWorkBasket}
      isAllCases={isAllCases}
      isQcFlag={isQcFlag}
      userRoleRejectCase={userRoleRejectCase}
      isIssueDocumentStage={isIssueDocumentStage}
      isValidRPSection={isValidRPSection}
      isCheckSigningCase={isCheckSigningCase}
      isRejectPendingActionStage={isRejectPendingActionStage}
      handlers={{
        issueDocumentsHandler,
        handleRejectCase,
        newRfiHandler,
        manageDocuments,
        checkSigningHandler,
      }}
    />
  );
}
