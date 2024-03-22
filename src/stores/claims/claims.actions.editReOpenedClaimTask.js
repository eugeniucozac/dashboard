import * as constants from 'consts';

// app
import * as utils from 'utils';
import { authLogout, addLoader, enqueueNotification, hideModal, removeLoader } from 'stores';

export const editReOpenedClaimTask = (taskObj, formData, priorities) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint } } } = getState();

  const defaultError = {
    file: 'stores/claims.actions.editReOpenedClaimTask',
  };

  const data = {
    taskListID: taskObj?.taskListID,
    processTypeID: taskObj?.processTypeID,
    taskCode: taskObj?.taskCode,
    taskLabel: taskObj?.taskLabel,
    actionListValues: taskObj?.actionListValues,
    priority: priorities?.find((item) => item.description === constants.CREATE_ADHOC_TASK_PRIORITY_MEDIUM)?.id,
  };

  dispatch(editReOpenedClaimTaskRequest(data));
  dispatch(addLoader('editReOpenedClaimTask'));

  if (!formData || (!formData.taskListID && !formData.processID)) {
    dispatch(editReOpenedClaimTaskFailure(defaultError));
    dispatch(enqueueNotification('notification.setReOpenedTask.fail', 'error'));
    dispatch(removeLoader('editReOpenedClaimTask'));
    return;
  }

  return utils.api
    .post({
      token: auth.accessToken,
      endpoint: endpoint.bpmService,
      path: `/workflow/process/claim/${formData?.processID}/reopen`,
      data: data,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((data) => {
      dispatch(editReOpenedClaimTaskSuccess(data?.data));
      dispatch(enqueueNotification('notification.claimReOpened.success', 'success'));
      dispatch(hideModal());
      return data.data;
    })
    .catch((err) => {
      const errorMessage = err?.json?.message || 'notification.claimReOpened.fail';
      const errorParams = {
        ...defaultError,
        message: 'API fetch error (claims.actions.editReOpenedClaimTask)',
      };

      utils.api.handleError(err, errorParams);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(editReOpenedClaimTaskFailure(err));
      dispatch(enqueueNotification(errorMessage, 'error'));
      return err;
    })
    .finally(() => {
      dispatch(removeLoader('editReOpenedClaimTask'));
    });
};

export const editReOpenedClaimTaskRequest = (params) => {
  return {
    type: 'CLAIMS_EDIT_RE_OPENED_TASK_REQUEST',
    payload: params,
  };
};

export const editReOpenedClaimTaskSuccess = (data) => {
  return {
    type: 'CLAIMS_EDIT_RE_OPENED_TASK_SUCCESS',
    payload: data,
  };
};

export const editReOpenedClaimTaskFailure = (error) => {
  return {
    type: 'CLAIMS_EDIT_RE_OPENED_TASK_FAILURE',
    payload: error,
  };
};
