// app
import * as utils from 'utils';
import { authLogout, addLoader, enqueueNotification, hideModal, removeLoader } from 'stores';

export const postEditTaskPriority = (formData) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint } } } = getState();

  const defaultError = {
    file: 'stores/claims.actions.postEditTaskPriority',
  };

  dispatch(postEditTaskPriorityRequest(formData));
  dispatch(addLoader('postEditTaskPriority'));

  if (!formData || (!formData.taskId && !formData.priority)) {
    dispatch(postEditTaskPriorityFailure(defaultError));
    dispatch(enqueueNotification('notification.setPriority.fail', 'error'));
    dispatch(removeLoader('postEditTaskPriority'));
    return;
  }

  const { priority, taskId } = formData;
  // get the data for PATCH
  const data = {
    priority: priority,
    taskId: taskId,
  };
  return utils.api
    .post({
      token: auth.accessToken,
      endpoint: endpoint.bpmService,
      path: `workflow/process/update/task/priority`,
      data,
    })
    .then((response) => {
      return utils.api.handleResponse(response);
    })
    .then((json) => utils.api.handleNewData(json))
    .then((data) => {
      dispatch(postEditTaskPrioritySuccess(data));
      dispatch(enqueueNotification('notification.setPriority.success', 'success'));
    })
    .catch((err) => {
      const errorParams = {
        ...defaultError,
        message: 'API fetch error (claims.postEditTaskPriority)',
      };

      utils.api.handleError(err, errorParams);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(postEditTaskPriorityFailure(err));
      dispatch(enqueueNotification('notification.setPriority.fail', 'error'));
      return err;
    })
    .finally(() => {
      dispatch(removeLoader('postEditTaskPriority'));
      dispatch(hideModal());
    });
};

export const postEditTaskPriorityRequest = (params) => {
  return {
    type: 'CLAIMS_TASK_PRIORITY_EDIT_POST_REQUEST',
    payload: params,
  };
};

export const postEditTaskPrioritySuccess = (data) => {
  return {
    type: 'CLAIMS_TASK_PRIORITY_POST_SUCCESS',
    payload: data,
  };
};

export const postEditTaskPriorityFailure = (error) => {
  return {
    type: 'CLAIMS_TASK_PRIORITY_POST_FAILURE',
    payload: error,
  };
};
