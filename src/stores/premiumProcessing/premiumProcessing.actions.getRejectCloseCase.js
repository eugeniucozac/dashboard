import * as utils from 'utils';
import { authLogout, addLoader, enqueueNotification, removeLoader } from 'stores';

export const getRejectCloseCase = (params) => (dispatch, getState) => {
  const {
    user: { auth },
    config: {
      vars: { endpoint },
    },
  } = getState();

  const defaultError = {
    file: 'stores/premiumProcessing.actions.getRejectCloseCase',
  };

  const { taskId, notesFieldValue, policyRef } = params;

  const rejectCloseCaseRequestBody = {
    bpmTaskId: taskId,
    notes: notesFieldValue,
    policyRef: policyRef,
  };

  dispatch(getRejectCloseCaseRequest(rejectCloseCaseRequestBody));
  dispatch(addLoader('getRejectCloseCase'));

  return utils.api
    .post({
      token: auth.accessToken,
      endpoint: endpoint.bpmService,
      path: 'workflow/task/rejectclosed',
      data: rejectCloseCaseRequestBody,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleNewData(json))
    .then((data) => {
      dispatch(getRejectCloseCaseSuccess(data?.data));
      dispatch(enqueueNotification('premiumProcessing.checkSigningReject.rejectCloseSuccessMessage', 'success'));
      return data;
    })
    .catch((error) => {
      utils.api.handleError(error, { ...defaultError, message: 'API fetch error (premiumProcessing.getRejectcloseCase)' });
      dispatch(getRejectCloseCaseError(error));
      utils.api.handleUnauthorized(error, dispatch, authLogout);
      return error;
    })
    .finally(() => {
      dispatch(removeLoader('getRejectCloseCase'));
    });
};

export const getRejectCloseCaseRequest = (payload) => {
  return {
    type: 'PREMIUM_PROCESSING_REJECT_CLOSE_CASE_REQUEST',
    payload,
  };
};

export const getRejectCloseCaseSuccess = (data) => {
  return {
    type: 'PREMIUM_PROCESSING_REJECT_CLOSE_CASE_SUCCESS',
    payload: data,
  };
};

export const getRejectCloseCaseError = (error) => {
  return {
    type: 'PREMIUM_PROCESSING_REJECT_CLOSE_CASE_ERROR',
    payload: error,
  };
};
