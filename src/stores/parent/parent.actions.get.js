import * as utils from 'utils';
import { authLogout, addLoader, removeLoader } from 'stores';

export const getParent = (parentId) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}} = getState();

  dispatch(getParentRequest(parentId));
  dispatch(addLoader('getParent'));

  return utils.api
    .get({
      token: auth.accessToken,
      endpoint: endpoint.edge,
      path: `api/client/parent/${parentId}`,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleData(json))
    .then((data) => {
      dispatch(getParentSuccess(data));
      dispatch(removeLoader('getParent'));
      return data;
    })
    .catch((err) => {
      const errorParams = {
        file: 'stores/parent.actions.get',
        message: 'API fetch error (parent.get)',
      };

      utils.api.handleError(err, errorParams);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(getParentFailure(err));
      dispatch(removeLoader('getParent'));
      return err;
    });
};

export const getParentRequest = (parentId) => {
  return {
    type: 'PARENT_GET_REQUEST',
    payload: parentId,
  };
};

export const getParentSuccess = (responseData) => {
  return {
    type: 'PARENT_GET_SUCCESS',
    payload: responseData,
  };
};

export const getParentFailure = (error) => {
  return {
    type: 'PARENT_GET_FAILURE',
    payload: error,
  };
};
