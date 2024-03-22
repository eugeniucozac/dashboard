import { addLoader, authLogout, removeLoader } from 'stores';
import * as utils from 'utils';

export const getReOpenTaskLists = () => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint } } } = getState();

  const defaultError = {
    file: 'stores/claims.actions.getReOpenTaskLists',
  };

  dispatch(getReOpenTaskListsRequest());
  dispatch(addLoader('getReOpenTaskLists'));

  return utils.api
    .get({
      token: auth.accessToken,
      endpoint: endpoint.bpmService,
      path: 'workflow/task/ReopenClaim/nextTaskList',
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleNewData(json))
    .then((data) => {
      const res = data?.data;
      dispatch(getReOpenTaskListsSuccess(res));
      return res;
    })
    .catch((err) => {
      dispatch(getReOpenTaskListsFailure(err, defaultError));
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      return err;
    })
    .finally(() => {
      dispatch(removeLoader('getReOpenTaskLists'));
    });
};

export const getReOpenTaskListsRequest = () => {
  return {
    type: 'CLAIMS_REOPEN_TASK_LIST_GET_REQUEST',
  };
};

export const getReOpenTaskListsSuccess = (data) => {
  return {
    type: 'CLAIMS_REOPEN_TASK_LIST_GET_SUCCESS',
    payload: data,
  };
};

export const getReOpenTaskListsFailure = (err) => {
  return {
    type: 'CLAIMS_REOPEN_TASK_LIST_GET_FAILURE',
    payload: err,
  };
};
