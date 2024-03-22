import { authLogout, addLoader, removeLoader } from 'stores';
import * as utils from 'utils';

export const getNextTaskList =
  (params = {}) =>
  (dispatch, getState) => {
    // prettier-ignore
    const { user: { auth }, config: { vars: { endpoint } } } = getState();

    const { taskCode } = params;
    const viewLoader = params?.viewLoader ?? true

    const defaultError = {
      file: 'stores/claims.actions.getNextTaskList',
    };

    dispatch(getNextTaskListRequest(params));
    viewLoader &&  dispatch(addLoader('getNextTaskList'));

    return utils.api
      .get({
        token: auth.accessToken,
        endpoint: endpoint.bpmService,
        path: `workflow/task/${taskCode}/nextTaskList`,
      })
      .then((response) => utils.api.handleResponse(response))
      .then((data) => utils.api.handleNewData(data))
      .then((json) => {
        dispatch(getNextTaskListSuccess(json));
        return json;
      })
      .catch((err) => {
        dispatch(getNextTaskListFailure(err, defaultError));
        utils.api.handleUnauthorized(err, dispatch, authLogout);
        return err;
      })
      .finally(() => {
        viewLoader &&   dispatch(removeLoader('getNextTaskList'));
      });
  };

export const getNextTaskListRequest = (params) => {
  return {
    type: 'CLAIMS_TASK_PROCESSING_GET_NEXT_TASKLIST_REQUEST',
    payload: params,
  };
};

export const getNextTaskListSuccess = (json) => {
  return {
    type: 'CLAIMS_TASK_PROCESSING_GET_NEXT_TASKLIST_SUCCESS',
    payload: json.data,
  };
};

export const getNextTaskListFailure = (error) => {
  return {
    type: 'CLAIMS_TASK_PROCESSING_GET_NEXT_TASKLIST_FAILURE',
    payload: error,
  };
};
