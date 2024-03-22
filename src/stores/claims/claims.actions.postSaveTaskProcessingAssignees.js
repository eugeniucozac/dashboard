import { addLoader, removeLoader, enqueueNotification, hideModal, authLogout } from 'stores';
import * as utils from 'utils';

export const postSaveTaskProcessingAssignees = (data) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint } } } = getState();

  const defaultError = {
    file: 'stores/claims.actions.postSaveTaskProcessingAssignees',
  };

  dispatch(postSaveTaskProcessingAssigneesRequest(data));
  dispatch(addLoader('postSaveTaskProcessingAssignees'));

  return utils.api
    .post({
      token: auth.accessToken,
      endpoint: endpoint.bpmService,
      path: 'workflow/process/task/saveAssignees',
      data: data,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleNewData(json, true))
    .then((data) => {
      dispatch(postSaveTaskProcessingAssigneesSuccess(data.data));
      dispatch(enqueueNotification(data.message, 'success'));
      dispatch(hideModal());
      return data;
    })
    .catch((error) => {
      dispatch(postSaveTaskProcessingAssigneesFailure(error, defaultError));
      dispatch(enqueueNotification(error.json.message, 'error'));
      utils.api.handleUnauthorized(error, dispatch, authLogout);
      return error;
    })
    .finally(() => {
      dispatch(removeLoader('postSaveTaskProcessingAssignees'));
    });
};

export const postSaveTaskProcessingAssigneesRequest = (data) => {
  return {
    type: 'CLAIMS_TASK_PROCESSING_SAVE_ASSIGNEES_REQUEST',
    payload: data,
  };
};

export const postSaveTaskProcessingAssigneesSuccess = (params) => {
  return {
    type: 'CLAIMS_TASK_PROCESSING_SAVE_ASSIGNEES_SUCCESS',
    payload: params,
  };
};

export const postSaveTaskProcessingAssigneesFailure = (error) => {
  return {
    type: 'CLAIMS_TASK_PROCESSING_SAVE_ASSIGNEES_ERROR',
    payload: error,
  };
};
