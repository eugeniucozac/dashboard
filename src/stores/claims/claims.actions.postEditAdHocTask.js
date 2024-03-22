import { addLoader, removeLoader, enqueueNotification, authLogout } from 'stores';
import * as utils from 'utils';

export const postEditAdHocTask = (adHocTaskData, taskId) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint } },claims :{adhocTask}} = getState();

  const adHocTaskDetails = { ...adhocTask?.data };
  const defaultError = {
    file: 'stores/claims.actions.postEditAdHocTask',
  };

  dispatch(postEditAdHocTaskRequest({ adHocTaskData, taskId }));
  dispatch(addLoader('postEditAdHocTask'));

  if (!adHocTaskData || !taskId) {
    dispatch(postEditAdHocTaskFailure({ ...defaultError, message: 'Missing requests params' }));
    dispatch(removeLoader('postEditAdHocTask'));
    return;
  }

  return utils.api
    .put({
      token: auth.accessToken,
      endpoint: endpoint.bpmService,
      path: `workflow/process/update/task/${taskId}/adhoc`,
      data: adHocTaskData,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleNewData(json))
    .then((data) => {
      dispatch(postEditAdHocTaskSuccess({ ...data, taskDetails: adHocTaskDetails }));
      dispatch(enqueueNotification(utils.string.t('claims.processing.notification.editAdhocSuccess'), 'success'));
      return data;
    })
    .catch((error) => {
      dispatch(postEditAdHocTaskFailure(error, defaultError));
      dispatch(enqueueNotification(utils.string.t('claims.processing.notification.editAdhocFailure'), 'error'));
      utils.api.handleUnauthorized(error, dispatch, authLogout);
      return error;
    })
    .finally(() => {
      dispatch(removeLoader('postEditAdHocTask'));
    });
};

export const postEditAdHocTaskRequest = ({ adHocTaskData, taskId }) => {
  return {
    type: 'CLAIMS_EDIT_ADHOC_TASK_POST_REQUEST',
    payload: { adHocTaskData, taskId },
  };
};

export const postEditAdHocTaskSuccess = (data) => {
  return {
    type: 'CLAIMS_EDIT_ADHOC_TASK_POST_SUCCESS',
    payload: data,
  };
};

export const postEditAdHocTaskFailure = (error) => {
  return {
    type: 'CLAIMS_EDIT_ADHOC_TASK_POST_FAILURE',
    payload: error,
  };
};
