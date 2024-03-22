import * as utils from 'utils';
import { authLogout, addLoader, removeLoader } from 'stores';

export const premiumProcessingBureauRFIDetails = (caseId) => (dispatch, getState) => {
  const {
    user: { auth },
    config: {
      vars: { endpoint },
    },
  } = getState();

  const defaultError = {
    file: 'stores/premiumProcessing.actions.premiumProcessingBureauRFIDetails',
  };

  if (!caseId) {
    dispatch(premiumProcessingBureauRFIDetailsError({ ...defaultError, message: 'Missing insured or cover holder name search query' }));
    return;
  }

  dispatch(premiumProcessingBureauRFIDetailsRequest(caseId));
  dispatch(addLoader('premiumProcessingBureauRFIDetails'));

  return utils.api
    .get({
      token: auth.accessToken,
      endpoint: endpoint.bpmService,
      path: `workflow/task/newrfi/details/${caseId}`,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleNewData(json))
    .then((data) => {
      dispatch(premiumProcessingBureauRFIDetailsSuccess(data?.data));
      return data?.data;
    })
    .catch((error) => {
      utils.api.handleError(error, { ...defaultError, message: 'API fetch error (premiumProcessingBureauRFIDetails)' });
      dispatch(premiumProcessingBureauRFIDetailsError(error));
      utils.api.handleUnauthorized(error, dispatch, authLogout);
    })
    .finally(() => {
      dispatch(removeLoader('premiumProcessingBureauRFIDetails'));
    });
};
export const premiumProcessingBureauRFIDetailsRequest = (caseId) => {
  return {
    type: 'PREMIUM_PROCESSING_BUREAU_RFI_DETAILS_REQUEST',
    payload: caseId,
  };
};
export const premiumProcessingBureauRFIDetailsSuccess = (data) => {
  return {
    type: 'PREMIUM_PROCESSING_BUREAU_RFI_DETAILS_SUCCESS',
    payload: data,
  };
};

export const premiumProcessingBureauRFIDetailsError = (error) => {
  return {
    type: 'PREMIUM_PROCESSING_BUREAU_RFI_DETAILS_ERROR',
    payload: error,
  };
};
