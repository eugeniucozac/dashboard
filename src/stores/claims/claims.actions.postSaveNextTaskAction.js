import { addLoader, removeLoader, enqueueNotification, hideModal, authLogout } from 'stores';
import * as utils from 'utils';

export const postSaveNextTaskAction = (taskId, data) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint } } } = getState();

  const defaultError = {
    file: 'stores/claims.actions.postSaveNextTaskAction',
  };

  if (!taskId) {
    dispatch(postSaveNextTaskActionFailure({ ...defaultError, message: 'Missing requests params' }));
    dispatch(enqueueNotification('Missing requests params', 'error'));
    dispatch(removeLoader('postSaveNextTaskAction'));
    return;
  }

  dispatch(postSaveNextTaskActionRequest(taskId, data));
  dispatch(addLoader('postSaveNextTaskAction'));

  return utils.api
    .post({
      token: auth.accessToken,
      endpoint: endpoint.bpmService,
      path: `workflow/task/${taskId}/next`,
      data: data,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleNewData(json, true))
    .then((data) => {
      dispatch(postSaveNextTaskActionSuccess(data.data));
      dispatch(
        enqueueNotification(data.message, 'success', {
          keepAfterUrlChange: true,
        })
      );
      dispatch(hideModal());
      return data;
    })
    .catch((error) => {
      dispatch(postSaveNextTaskActionFailure(error, defaultError));
      dispatch(
        enqueueNotification(error.json.message, 'error', {
          keepAfterUrlChange: true,
        })
      );
      utils.api.handleUnauthorized(error, dispatch, authLogout);
      return error;
    })
    .finally(() => {
      dispatch(removeLoader('postSaveNextTaskAction'));
    });
};

export const postSaveNextTaskActionRequest = (params) => {
  return {
    type: 'CLAIMS_TASK_PROCESSING_SAVE_NEXT_ACTION_REQUEST',
    payload: params,
  };
};

export const postSaveNextTaskActionSuccess = (data) => {
  return {
    type: 'CLAIMS_TASK_PROCESSING_SAVE_NEXT_ACTION_SUCCESS',
    payload: data,
  };
};

export const postSaveNextTaskActionFailure = (error) => {
  return {
    type: 'CLAIMS_TASK_PROCESSING_SAVE_NEXT_ACTION_ERROR',
    payload: error,
  };
};
