import { removeLoader, addLoader, enqueueNotification, authLogout } from 'stores';
import * as constants from 'consts';
import * as utils from 'utils';
import get from 'lodash/get';

export const postNewWorkflowStage = (params) => (dispatch, getState) => {
  const {
    user: { auth },
    config: {
      vars: { endpoint },
    },
  } = getState();

  const defaultError = {
    file: 'stores/premiumProcessing.actions.postNewWorkflowStage',
  };

  const { taskId, notes, isQcApproved, isReSubmitted, policyRef } = params;

  dispatch(postNewWorkflowStageRequest(params));
  dispatch(addLoader('postNewWorkflowStage'));

  if (!taskId) {
    dispatch(postNewWorkflowStageFailure({ ...defaultError, message: 'Missing parameters' }));
    dispatch(removeLoader('postNewWorkflowStage'));
    return;
  }

  const requestObject = {
    bpmTaskId: taskId,
    policyRef: policyRef,
  };

  if (isQcApproved) {
    requestObject.notes = notes || '';
    requestObject.isQcApproved = isQcApproved === 'yes' ? true : false;
  }
  if (isReSubmitted) {
    requestObject.notes = notes;
    requestObject.isResubmitted = isReSubmitted;
  }

  return utils.api
    .post({
      token: auth.accessToken,
      endpoint: endpoint.bpmService,
      path: `workflow/task/moveNextStage`,
      data: requestObject,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleNewData(json))
    .then((data) => {
      dispatch(postNewWorkflowStageSuccess(data));
      const reSubmitFlag = Boolean(data?.data?.flag);
      const isInstructionReOpen = get(data?.data, 'isInstructionReOpen') ? true : false;
      if (isInstructionReOpen) {
        dispatch(enqueueNotification(utils.string.t('premiumProcessing.caseDetailsSection.workflowStagePiError'), 'error'));
      } else {
        if (data?.message.toUpperCase() === constants.API_RESPONSE_SUCCESS && !reSubmitFlag) {
          dispatch(enqueueNotification(utils.string.t('premiumProcessing.caseDetailsSection.workflowStageUpdateSuccess'), 'success'));
        } else if (data?.message.toUpperCase() === constants.API_RESPONSE_SUCCESS && reSubmitFlag) {
          dispatch(enqueueNotification(utils.string.t('premiumProcessing.reSubmitCases.reSubmitToastMsg'), 'success'));
        } else {
          dispatch(enqueueNotification(utils.string.t('premiumProcessing.caseDetailsSection.workflowStageUpdateError'), 'error'));
        }
      }
      return data;
    })
    .catch((error) => {
      utils.api.handleError(error, { ...defaultError, message: 'API fetch error (premiumProcessing.postNewWorkflowStage)' });
      utils.api.handleUnauthorized(error, dispatch, authLogout);
      dispatch(
        postNewWorkflowStageFailure(error, {
          file: 'stores/premiumProcessing.actions.postNewWorkflowStage',
        })
      );
      return error?.json;
    })
    .finally(() => {
      dispatch(removeLoader('postNewWorkflowStage'));
    });
};

export const postNewWorkflowStageRequest = (payload) => {
  return {
    type: 'PREMIUM_PROCESSING_POST_WORKFLOW_STAGE_REQUEST',
    payload,
  };
};

export const postNewWorkflowStageSuccess = (data) => {
  return {
    type: 'PREMIUM_PROCESSING_POST_WORKFLOW_STAGE_SUCCESS',
    payload: data,
  };
};

export const postNewWorkflowStageFailure = (error) => {
  return {
    type: 'PREMIUM_PROCESSING_POST_WORKFLOW_STAGE_FAILURE',
    payload: error,
  };
};
