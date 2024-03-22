import { addLoader, removeLoader, enqueueNotification, authLogout } from 'stores';
import * as utils from 'utils';

export const postSaveAdHocTask = (adHocTaskData) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint } } } = getState();

  const defaultError = {
    file: 'stores/claims.actions.postSaveAdHocTask',
  };

  dispatch(postSaveAdHocTaskRequest(adHocTaskData));
  dispatch(addLoader('postSaveAdHocTask'));

  if (!adHocTaskData) {
    dispatch(postSaveAdHocTaskFailure({ ...defaultError, message: 'Missing requests params' }));
    dispatch(removeLoader('postSaveAdHocTask'));
    return;
  }
  return utils.api
    .post({
      token: auth.accessToken,
      endpoint: endpoint.bpmService,
      path: 'workflow/process/task/adhoc',
      data: adHocTaskData,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleNewData(json))
    .then((data) => {
      dispatch(postSaveAdHocTaskSuccess(data));
      dispatch(enqueueNotification(utils.string.t('claims.processing.notification.addAdhocSuccess'), 'success'));
      return data;
    })
    .catch((error) => {
      dispatch(postSaveAdHocTaskFailure(error, defaultError));
      dispatch(enqueueNotification(utils.string.t('claims.processing.notification.addAdhocFailure'), 'error'));
      utils.api.handleUnauthorized(error, dispatch, authLogout);
      return error;
    })
    .finally(() => {
      dispatch(removeLoader('postSaveAdHocTask'));
    });
};

export const postSaveAdHocTaskRequest = (adHocTaskData) => {
  return {
    type: 'CLAIMS_SAVE_ADHOC_TASK_POST_REQUEST',
    payload: adHocTaskData,
  };
};

export const postSaveAdHocTaskSuccess = (data) => {
  return {
    type: 'CLAIMS_SAVE_ADHOC_TASK_POST_SUCCESS',
    payload: data,
  };
};

export const postSaveAdHocTaskFailure = (error) => {
  return {
    type: 'CLAIMS_SAVE_ADHOC_TASK_POST_FAILURE',
    payload: error,
  };
};
