import { authLogout, addLoader, removeLoader, enqueueNotification } from 'stores';
import * as utils from 'utils';

export const postCloseRFI = (taskID) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint } } } = getState();
  const defaultError = {
    file: 'stores/claims.actions.postCloseRFI',
  };

  dispatch(postCloseRFIRequest(taskID));
  dispatch(addLoader('postCloseRFI'));

  if (!taskID) {
    dispatch(postCloseRFIFailure({ ...defaultError, message: 'Missing requests params' }));
    dispatch(removeLoader('postCloseRFI'));
    return;
  }

  return utils.api
    .post({
      token: auth.accessToken,
      endpoint: endpoint.bpmService,
      path: `api/workflow/process/rfi/${taskID}/close`,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((data) => {
      dispatch(postCloseRFISuccess(data));
      dispatch(enqueueNotification(utils.string.t('claims.processing.notification.closeRfiSuccess'), 'success'));
      return data;
    })
    .catch((error) => {
      dispatch(postCloseRFIFailure(error, defaultError));
      utils.api.handleUnauthorized(error, dispatch, authLogout);
      dispatch(enqueueNotification(utils.string.t('claims.processing.notification.closeRfiFailure'), 'error'));
      return error;
    })
    .finally(() => {
      dispatch(removeLoader('postCloseRFI'));
    });
};

export const postCloseRFIRequest = (taskID) => {
  return {
    type: 'CLAIMS_CLOSE_RFI_POST_REQUEST',
    payload: { taskID },
  };
};

export const postCloseRFISuccess = (data) => {
  return {
    type: 'CLAIMS_CLOSE_RFI_POST_SUCCESS',
    payload: data,
  };
};

export const postCloseRFIFailure = (error) => {
  return {
    type: 'CLAIMS_CLOSE_RFI_POST_FAILURE',
    payload: error,
  };
};
