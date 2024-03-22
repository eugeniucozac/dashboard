import { addLoader, removeLoader, enqueueNotification, authLogout } from 'stores';
import * as utils from 'utils';

export const postUpdateRFI = (rfiData) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint } } } = getState();

  const defaultError = {
    file: 'stores/claims.actions.postUpdateRFI',
  };

  dispatch(postUpdateRFIRequest(rfiData));
  dispatch(addLoader('postUpdateRFI'));

  if (!rfiData) {
    dispatch(postUpdateRFIFailure({ ...defaultError, message: 'Missing requests params' }));
    dispatch(removeLoader('postUpdateRFI'));
    return;
  }

  return utils.api
    .put({
      token: auth.accessToken,
      endpoint: endpoint.bpmService,
      path: `api/workflow/process/rfi/updateClaimsRFI`,
      data: rfiData,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleNewData(json))
    .then((data) => {
      dispatch(postUpdateRFISuccess(data.data));
      dispatch(enqueueNotification(utils.string.t('claims.processing.notification.updateRfiSuccess'), 'success'));
      return data;
    })
    .catch((error) => {
      dispatch(postUpdateRFIFailure(error, defaultError));
      dispatch(enqueueNotification(utils.string.t('claims.processing.notification.updateRfiFailure'), 'error'));
      utils.api.handleUnauthorized(error, dispatch, authLogout);
      return error;
    })
    .finally(() => {
      dispatch(removeLoader('postUpdateRFI'));
    });
};

export const postUpdateRFIRequest = (rfiData) => {
  return {
    type: 'CLAIMS_UPDATE_RFI_POST_REQUEST',
    payload: rfiData,
  };
};

export const postUpdateRFISuccess = (data) => {
  return {
    type: 'CLAIMS_UPDATE_RFI_POST_SUCCESS',
    payload: data,
  };
};

export const postUpdateRFIFailure = (error) => {
  return {
    type: 'CLAIMS_UPDATE_RFI_POST_FAILURE',
    payload: error,
  };
};
