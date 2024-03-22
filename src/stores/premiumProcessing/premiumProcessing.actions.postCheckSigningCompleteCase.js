import * as utils from 'utils';
import { authLogout, addLoader, enqueueNotification, removeLoader } from 'stores';

export const premiumProcessingCheckSigningCompleteCase = (params) => (dispatch, getState) => {
  const {
    user: { auth },
    config: {
      vars: { endpoint },
    },
  } = getState();

  const defaultError = {
    file: 'stores/premiumProcessing.actions.postCheckSigningCompleteCase',
  };

  const { caseId, notesField } = params;

  const requestBody = {
    caseId: caseId,
    notes: notesField,
  };

  dispatch(premiumProcessingCheckSigningCompleteCaseRequest(requestBody));
  dispatch(addLoader('premiumProcessingCheckSigningCompleteCase'));

  return utils.api
    .post({
      token: auth.accessToken,
      endpoint: endpoint.bpmService,
      path: 'checksigning/task/Completed',
      data: requestBody,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleNewData(json))
    .then((data) => {
      dispatch(premiumProcessingCheckSigningCompleteCaseSuccess(data?.data));
      dispatch(enqueueNotification('premiumProcessing.checkSigningComplete.completeSuccessMessage', 'success'));
      return data;
    })
    .catch((error) => {
      utils.api.handleError(error, { ...defaultError, message: 'API fetch error (premiumProcessing.getRejectcloseCase)' });
      dispatch(premiumProcessingCheckSigningCompleteCaseError(error));
      utils.api.handleUnauthorized(error, dispatch, authLogout);
      return error;
    })
    .finally(() => {
      dispatch(removeLoader('premiumProcessingCheckSigningCompleteCase'));
    });
};

export const premiumProcessingCheckSigningCompleteCaseRequest = (payload) => {
  return {
    type: 'PREMIUM_PROCESSING_CHECK_SIGNING_COMPLETE_REQUEST',
    payload,
  };
};

export const premiumProcessingCheckSigningCompleteCaseSuccess = (data) => {
  return {
    type: 'PREMIUM_PROCESSING_CHECK_SIGNING_COMPLETE_SUCCESS',
    payload: data,
  };
};

export const premiumProcessingCheckSigningCompleteCaseError = (error) => {
  return {
    type: 'PREMIUM_PROCESSING_CHECK_SIGNING_COMPLETE_ERROR',
    payload: error,
  };
};
