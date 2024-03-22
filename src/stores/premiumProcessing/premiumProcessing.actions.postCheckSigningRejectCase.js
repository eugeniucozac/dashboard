import * as utils from 'utils';
import { authLogout, addLoader, enqueueNotification, removeLoader, hideModal } from 'stores';

export const premiumProcessingCheckSigningRejectCase = (params) => (dispatch, getState) => {
  const {
    user: { auth },
    config: {
      vars: { endpoint },
    },
  } = getState();

  const defaultError = {
    file: 'stores/premiumProcessing.actions.postCheckSigningRejectCase',
  };

  const selectedCasesData = params?.selectedCases[0];
  const requestBody = {
    caseId: selectedCasesData?.caseId,
    notes: params.notesFieldValue,
  };

  dispatch(premiumProcessingCheckSigningRejectCaseRequest(requestBody));
  dispatch(addLoader('premiumProcessingCheckSigningRejectCase'));

  return utils.api
    .post({
      token: auth.accessToken,
      endpoint: endpoint.bpmService,
      path: 'checksigning/task/Rejected',
      data: requestBody,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleNewData(json))
    .then((data) => {
      dispatch(premiumProcessingCheckSigningRejectCaseSuccess(data?.data));
      dispatch(enqueueNotification('premiumProcessing.checkSigningReject.rejectSuccessMessage', 'success'));
      dispatch(hideModal());
      return data;
    })
    .catch((error) => {
      utils.api.handleError(error, {
        ...defaultError,
        message: 'API fetch error (premiumProcessing.premiumProcessingCheckSigningRejectCase)',
      });
      dispatch(premiumProcessingCheckSigningRejectCaseError(error));
      dispatch(enqueueNotification('premiumProcessing.checkSigningReject.rejectFailureMessage', 'error'));
      utils.api.handleUnauthorized(error, dispatch, authLogout);
      return error;
    })
    .finally(() => {
      dispatch(removeLoader('premiumProcessingCheckSigningRejectCase'));
      dispatch(hideModal());
    });
};

export const premiumProcessingCheckSigningRejectCaseRequest = (payload) => {
  return {
    type: 'PREMIUM_PROCESSING_CHECK_SIGNING_REJECT_REQUEST',
    payload,
  };
};

export const premiumProcessingCheckSigningRejectCaseSuccess = (data) => {
  return {
    type: 'PREMIUM_PROCESSING_CHECK_SIGNING_REJECT_SUCCESS',
    payload: data,
  };
};

export const premiumProcessingCheckSigningRejectCaseError = (error) => {
  return {
    type: 'PREMIUM_PROCESSING_CHECK_SIGNING_REJECT_ERROR',
    payload: error,
  };
};
