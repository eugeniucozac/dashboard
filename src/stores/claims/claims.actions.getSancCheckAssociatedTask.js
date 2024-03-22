import * as utils from 'utils';
import { authLogout, addLoader, removeLoader } from 'stores';

export const getSancCheckAssociatedTask = (taskId) => (dispatch, getState) => {
  const {
    user: { auth },
    config: {
      vars: { endpoint },
    },
  } = getState();
  const defaultError = {
    file: 'stores/claims.actions.getSancCheckAssociatedTask',
  };

  dispatch(getAssociatedTaskRequest());
  dispatch(addLoader('getAssociatedTask'));

  return utils.api
    .get({
      token: auth.accessToken,
      endpoint: endpoint.bpmService,
      path: `workflow/task/${taskId}`,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleNewData(json))
    .then((data) => {
      dispatch(getAssociatedTaskRequestSuccess(data.data));
      dispatch(removeLoader('getAssociatedTask'));
      return data.data;
    })
    .catch((err) => {
      const errorParams = {
        ...defaultError,
        message: 'API post error',
      };

      utils.api.handleError(err, errorParams);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(getAssociatedTaskRequestFailure(err));
      dispatch(removeLoader('getAssociatedTask'));
      return err;
    });
};

export const getAssociatedTaskRequest = (params) => {
  return {
    type: 'GET_ASSOCIATED_TASK_REQUEST',
    payload: params,
  };
};

export const getAssociatedTaskRequestSuccess = (data) => {
  return {
    type: 'GET_ASSOCIATED_TASK_SUCCESS',
    payload: data,
  };
};

export const getAssociatedTaskRequestFailure = (error) => {
  return {
    type: 'GET_ASSOCIATED_TASK_FAILURE',
    payload: error,
  };
};
