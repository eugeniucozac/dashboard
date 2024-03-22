import { authLogout, addLoader, removeLoader, enqueueNotification } from 'stores';
import * as utils from 'utils';

export const postSendRFI = (rfiData) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint } } } = getState();
  const defaultError = {
    file: 'stores/claims.actions.postSendRFI',
  };

  dispatch(postSendRFIRequest(rfiData));
  dispatch(addLoader('postSendRFI'));

  if (!rfiData) {
    dispatch(postSendRFIFailure({ ...defaultError, message: 'Missing requests params' }));
    dispatch(removeLoader('postSendRFI'));
    return;
  }

  return utils.api
    .post({
      token: auth.accessToken,
      endpoint: endpoint.bpmService,
      path: 'api/workflow/process/rfi-reply',
      data: rfiData,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleNewData(json))
    .then((data) => {
      dispatch(postSendRFISuccess(data));
      dispatch(enqueueNotification(utils.string.t('claims.processing.notification.sendRfiSuccess'), 'success'));
      return data;
    })
    .catch((error) => {
      dispatch(postSendRFIFailure(error, defaultError));
      utils.api.handleUnauthorized(error, dispatch, authLogout);
      dispatch(enqueueNotification(utils.string.t('claims.processing.notification.sendRfiFailure'), 'error'));
      return error;
    })
    .finally(() => {
      dispatch(removeLoader('postSendRFI'));
    });
};

export const postSendRFIRequest = (rfiData) => {
  return {
    type: 'CLAIMS_SEND_RFI_POST_REQUEST',
    payload: { rfiData },
  };
};

export const postSendRFISuccess = (data) => {
  return {
    type: 'CLAIMS_SEND_RFI_POST_SUCCESS',
    payload: data,
  };
};

export const postSendRFIFailure = (error) => {
  return {
    type: 'CLAIMS_SEND_RFI_POST_FAILURE',
    payload: error,
  };
};
