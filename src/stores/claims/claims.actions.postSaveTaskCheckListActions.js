import { addLoader, removeLoader, enqueueNotification, hideModal, authLogout } from 'stores';
import * as utils from 'utils';

export const postSaveTaskCheckListActions = (taskId, data) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint } } } = getState();

  const defaultError = {
    file: 'stores/claims.actions.postSaveTaskCheckListActions',
  };

  if (!taskId) {
    dispatch(postSaveTaskCheckListActionsFailure({ ...defaultError, message: 'Missing requests params' }));
    dispatch(enqueueNotification('Missing requests params', 'error'));
    dispatch(removeLoader('postSaveTaskCheckListActions'));
    return;
  }

  dispatch(postSaveTaskCheckListActionsRequest(taskId, data));
  dispatch(addLoader('postSaveTaskCheckListActions'));

  return utils.api
    .post({
      token: auth.accessToken,
      endpoint: endpoint.bpmService,
      path: `workflow/task/${taskId}/detail`,
      data: data,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleNewData(json, true))
    .then((data) => {
      dispatch(postSaveTaskCheckListActionsSuccess(data.data));
      dispatch(
        enqueueNotification(data.message, 'success', {
          keepAfterUrlChange: true,
        })
      );
      dispatch(hideModal());
      return data;
    })
    .catch((error) => {
      dispatch(postSaveTaskCheckListActionsFailure(error, defaultError));
      dispatch(
        enqueueNotification(error.json.message, 'error', {
          keepAfterUrlChange: true,
        })
      );
      utils.api.handleUnauthorized(error, dispatch, authLogout);
      return error;
    })
    .finally(() => {
      dispatch(removeLoader('postSaveTaskCheckListActions'));
    });
};

export const postSaveTaskCheckListActionsRequest = (params) => {
  return {
    type: 'CLAIMS_TASK_PROCESSING_SAVE_CHECKLIST_ACTIONS_REQUEST',
    payload: params,
  };
};

export const postSaveTaskCheckListActionsSuccess = (data) => {
  return {
    type: 'CLAIMS_TASK_PROCESSING_SAVE_CHECKLIST_ACTIONS_SUCCESS',
    payload: data,
  };
};

export const postSaveTaskCheckListActionsFailure = (error) => {
  return {
    type: 'CLAIMS_TASK_PROCESSING_SAVE_CHECKLIST_ACTIONS_ERROR',
    payload: error,
  };
};
