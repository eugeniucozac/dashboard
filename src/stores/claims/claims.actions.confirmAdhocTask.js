import { addLoader, removeLoader, enqueueNotification, authLogout } from 'stores';
import * as utils from 'utils';

export const condirmAdHocTask = (confirmActionPayload, taskId) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint } }} = getState();

  const defaultError = {
    file: 'stores/claims.actions.confirmAdHocTask',
  };

  dispatch(confirmAdHocTaskRequest({ confirmActionPayload, taskId }));
  dispatch(addLoader('confirmAdHocTask'));

  if (!confirmActionPayload || !taskId) {
    dispatch(confirmAdHocTaskFailure({ ...defaultError, message: 'Missing requests params' }));
    dispatch(removeLoader('confirmAdHocTask'));
    return;
  }

  return utils.api
    .post({
      token: auth.accessToken,
      endpoint: endpoint.bpmService,
      path: `workflow/process/confirm/task/${taskId}/adhoc`,
      data: confirmActionPayload,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleNewData(json))
    .then((data) => {
      dispatch(confirmAdHocTaskSuccess(data));
      dispatch(enqueueNotification(utils.string.t('claims.processing.notification.adhocTaskSubmittedSuccess'), 'success'));
      return data;
    })
    .catch((error) => {
      dispatch(confirmAdHocTaskFailure(error, defaultError));
      dispatch(enqueueNotification(utils.string.t('claims.processing.notification.adhocTaskSubmittedFailure'), 'error'));
      utils.api.handleUnauthorized(error, dispatch, authLogout);
      return error;
    })
    .finally(() => {
      dispatch(removeLoader('confirmAdHocTask'));
    });
};

export const confirmAdHocTaskRequest = ({ confirmActionPayload, taskId }) => {
  return {
    type: 'CLAIMS_CONFIRM_ADHOC_TASK_POST_REQUEST',
    payload: { confirmActionPayload, taskId },
  };
};

export const confirmAdHocTaskSuccess = (data) => {
  return {
    type: 'CLAIMS_CONFIRM_ADHOC_TASK_POST_SUCCESS',
    payload: data,
  };
};

export const confirmAdHocTaskFailure = (error) => {
  return {
    type: 'CLAIMS_CONFIRM_ADHOC_TASK_POST_FAILURE',
    payload: error,
  };
};
