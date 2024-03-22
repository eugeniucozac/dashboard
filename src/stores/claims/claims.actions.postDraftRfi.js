import { addLoader, removeLoader, enqueueNotification, authLogout } from 'stores';
import * as utils from 'utils';

export const postDraftRFI = (rfiData) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint } } } = getState();

  const defaultError = {
    file: 'stores/claims.actions.postDraftRFI',
  };

  dispatch(postDraftRFIRequest(rfiData));
  dispatch(addLoader('postDraftRFI'));

  if (!rfiData) {
    dispatch(postDraftRFIFailure({ ...defaultError, message: 'Missing requests params' }));
    dispatch(removeLoader('postDraftRFI'));
    return;
  }

  return utils.api
    .post({
      token: auth.accessToken,
      endpoint: endpoint.bpmService,
      path: 'api/workflow/process/confirmClaimDraftRFI',
      data: rfiData,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleNewData(json))
    .then((data) => {
      dispatch(postDraftRFISuccess(data.data));
      dispatch(enqueueNotification(utils.string.t('claims.processing.notification.submitRfiSuccess'), 'success'));
      return data;
    })
    .catch((error) => {
      dispatch(postDraftRFIFailure(error, defaultError));
      dispatch(enqueueNotification(utils.string.t('claims.processing.notification.submitRfiFailure'), 'error'));
      utils.api.handleUnauthorized(error, dispatch, authLogout);
      return error;
    })
    .finally(() => {
      dispatch(removeLoader('postDraftRFI'));
    });
};

export const postDraftRFIRequest = (rfiData) => {
  return {
    type: 'CLAIMS_DRAFT_RFI_POST_REQUEST',
    payload: rfiData,
  };
};

export const postDraftRFISuccess = (data) => {
  return {
    type: 'CLAIMS_DRAFT_RFI_POST_SUCCESS',
    payload: data,
  };
};

export const postDraftRFIFailure = (error) => {
  return {
    type: 'CLAIMS_DRAFT_RFI_POST_FAILURE',
    payload: error,
  };
};
