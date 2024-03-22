import { addLoader, removeLoader, enqueueNotification, authLogout } from 'stores';
import * as utils from 'utils';

export const postSaveRFI = (rfiData) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint } } } = getState();

  const defaultError = {
    file: 'stores/claims.actions.postSaveRFI',
  };

  dispatch(postSaveRFIRequest(rfiData));
  dispatch(addLoader('postSaveRFI'));

  if (!rfiData) {
    dispatch(postSaveRFIFailure({ ...defaultError, message: 'Missing requests params' }));
    dispatch(removeLoader('postSaveRFI'));
    return;
  }

  return utils.api
    .post({
      token: auth.accessToken,
      endpoint: endpoint.bpmService,
      path: 'api/workflow/process/rfi/createClaimsRFI',
      data: rfiData,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleNewData(json))
    .then((data) => {
      dispatch(postSaveRFISuccess(data.data));
      dispatch(enqueueNotification(utils.string.t('claims.processing.notification.createRfiSuccess'), 'success'));
      return data;
    })
    .catch((error) => {
      dispatch(postSaveRFIFailure(error, defaultError));
      dispatch(enqueueNotification(utils.string.t('claims.processing.notification.createRfiFailure'), 'error'));
      utils.api.handleUnauthorized(error, dispatch, authLogout);
      return error;
    })
    .finally(() => {
      dispatch(removeLoader('postSaveRFI'));
    });
};

export const postSaveRFIRequest = (rfiData) => {
  return {
    type: 'CLAIMS_SAVE_RFI_POST_REQUEST',
    payload: rfiData,
  };
};

export const postSaveRFISuccess = (data) => {
  return {
    type: 'CLAIMS_SAVE_RFI_POST_SUCCESS',
    payload: data,
  };
};

export const postSaveRFIFailure = (error) => {
  return {
    type: 'CLAIMS_SAVE_RFI_POST_FAILURE',
    payload: error,
  };
};

export const postSaveRFIReset = () => {
  return {
    type: 'CLAIMS_SAVE_RFI_POST_RESET',
  };
};
