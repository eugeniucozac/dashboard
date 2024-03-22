import { removeLoader, addLoader, enqueueNotification, authLogout } from 'stores';
import * as utils from 'utils';

export const postBureauInsurerDetails = (payload) => (dispatch, getState) => {
  const {
    user: { auth },
    config: {
      vars: { endpoint },
    },
  } = getState();

  const defaultError = {
    file: 'stores/premiumProcessing.actions.postBureauInsurerDetails',
  };
  dispatch(postBureauInsurerDetailsRequest(payload));
  dispatch(addLoader('postBureauInsurerDetails'));

  if (!utils.generic.isValidArray(payload, true)) {
    dispatch(postBureauInsurerDetailsFailure({ ...defaultError, message: 'Missing parameters' }));
    dispatch(enqueueNotification('notification.submission.fail', 'error'));
    dispatch(removeLoader('postBureauInsurerDetails'));
    return;
  }

  return utils.api
    .post({
      token: auth.accessToken,
      endpoint: endpoint.bpmService,
      path: 'issueDocs/saveIssueDocsDetails',
      data: payload,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleNewData(json))
    .then((data) => {
      dispatch(postBureauInsurerDetailsSuccess(data?.data));
      return data;
    })
    .catch((error) => {
      utils.api.handleError(error, { ...defaultError, message: 'API fetch error (premiumProcessing.postBureauInsurerDetails)' });
      utils.api.handleUnauthorized(error, dispatch, authLogout);
      dispatch(
        postBureauInsurerDetailsFailure(error, {
          file: 'stores/premiumProcessing.actions.postBureauInsurerDetails',
        })
      );
      return error;
    })
    .finally(() => {
      dispatch(removeLoader('postBureauInsurerDetails'));
    });
};

export const postBureauInsurerDetailsRequest = (payload) => {
  return {
    type: 'PREMIUM_PROCESSING_BUREAU_DETAILS_POST_REQUEST',
    payload,
  };
};

export const postBureauInsurerDetailsSuccess = (data) => {
  return {
    type: 'PREMIUM_PROCESSING_BUREAU_DETAILS_POST_SUCCESS',
    payload: { items: data },
  };
};

export const postBureauInsurerDetailsFailure = (error) => {
  return {
    type: 'PREMIUM_PROCESSING_BUREAU_DETAILS_POST_FAILURE',
    payload: error,
  };
};
