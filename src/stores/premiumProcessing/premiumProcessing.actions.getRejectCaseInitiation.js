import * as utils from 'utils';
import { authLogout, addLoader, enqueueNotification, removeLoader } from 'stores';

export const premiumProcessingRejectCaseInitiation = (params) => (dispatch, getState) => {
  const {
    user: { auth },
    config: {
      vars: { endpoint },
    },
  } = getState();

  dispatch(addLoader('premiumProcessingRejectCaseInitiation'));
  const { caseId, taskId, notesValue, policyRef } = params;
  const rejectCase = {
    bpmTaskId: taskId,
    notes: notesValue,
    policyRef: policyRef,
  };

  return utils.api
    .post({
      token: auth.accessToken,
      endpoint: endpoint.bpmService,
      path: 'workflow/task/rejectinitiation',
      data: rejectCase,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleNewData(json))
    .then((data) => {
      dispatch(premiumProcessingRejectCaseInitiationSuccess(data?.data));
      dispatch(enqueueNotification(`CASE ID ${caseId} is now rejected and sent back to the Front end contact`, 'success'));
      return data;
    })
    .catch((error) => {
      dispatch(
        premiumProcessingRejectCaseInitiationError(error, {
          file: 'stores/premiumProcessing.actions.getRejectCaseInitiation',
        })
      );
      dispatch(enqueueNotification('premiumProcessing.rejectingCase.rejectCaseFailMsg.fail', 'error'));
      utils.api.handleUnauthorized(error, dispatch, authLogout);
      return error;
    })
    .finally(() => {
      dispatch(removeLoader('premiumProcessingRejectCaseInitiation'));
    });
};

export const premiumProcessingRejectCaseInitiationRequest = (payload) => {
  return {
    type: 'PREMIUM_PROCESSING_REJECT_CASE_INITIATION_REQUEST',
    payload,
  };
};

export const premiumProcessingRejectCaseInitiationSuccess = (data) => {
  return {
    type: 'PREMIUM_PROCESSING_REJECT_CASE_INITIATION_SUCCESS',
    payload: data,
  };
};

export const premiumProcessingRejectCaseInitiationError = (error) => {
  return {
    type: 'PREMIUM_PROCESSING_REJECT_CASE_INITIATION_ERROR',
    payload: error,
  };
};
