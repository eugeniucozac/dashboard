import * as utils from 'utils';
import { authLogout, addLoader, enqueueNotification, removeLoader } from 'stores';

export const premiumProcessingCheckSigningCancelCase = (params) => (dispatch, getState) => {
  const {
    user: { auth },
    config: {
      vars: { endpoint },
    },
  } = getState();

  const defaultError = {
    file: 'stores/premiumProcessing.actions.postCheckSigningCancelCase',
  };

  const { caseId, notesField } = params;

  const requestBody = {
    caseId: caseId,
    notes: notesField,
  };

  dispatch(premiumProcessingCheckSigningCancelCaseRequest(requestBody));
  dispatch(addLoader('premiumProcessingCheckSigningCancelCase'));

  return utils.api
    .post({
      token: auth.accessToken,
      endpoint: endpoint.bpmService,
      path: 'checksigning/task/cancelled',
      data: requestBody,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleNewData(json))
    .then((data) => {
      dispatch(premiumProcessingCheckSigningCancelCaseSuccess(data?.data));
      dispatch(enqueueNotification('premiumProcessing.checkSigningCancel.cancelSuccessMessage', 'success'));
      return data;
    })
    .catch((error) => {
      utils.api.handleError(error, { ...defaultError, message: 'API fetch error (premiumProcessing.getRejectcloseCase)' });
      dispatch(premiumProcessingCheckSigningCancelCaseError(error));
      utils.api.handleUnauthorized(error, dispatch, authLogout);
      return error;
    })
    .finally(() => {
      dispatch(removeLoader('premiumProcessingCheckSigningCancelCase'));
    });
};

export const premiumProcessingCheckSigningCancelCaseRequest = (payload) => {
  return {
    type: 'PREMIUM_PROCESSING_CHECK_SIGNING_CANCEL_REQUEST',
    payload,
  };
};

export const premiumProcessingCheckSigningCancelCaseSuccess = (data) => {
  return {
    type: 'PREMIUM_PROCESSING_CHECK_SIGNING_CANCEL_SUCCESS',
    payload: data,
  };
};

export const premiumProcessingCheckSigningCancelCaseError = (error) => {
  return {
    type: 'PREMIUM_PROCESSING_CHECK_SIGNING_CANCEL_ERROR',
    payload: error,
  };
};
