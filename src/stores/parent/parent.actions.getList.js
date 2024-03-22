import * as utils from 'utils';
import { authLogout, addLoader, removeLoader } from 'stores';

export const getParentList = () => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}} = getState();

  dispatch(getParentListRequest());
  dispatch(addLoader('getParentList'));

  return utils.api
    .get({
      token: auth.accessToken,
      endpoint: endpoint?.edge,
      path: 'api/client/parent',
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleData(json))
    .then((data) => {
      dispatch(getParentListSuccess(data));
      dispatch(removeLoader('getParentList'));
      return data;
    })
    .catch((err) => {
      const errorParams = {
        file: 'stores/parent.actions.getList',
        message: 'API fetch error (parent.getList)',
      };

      utils.api.handleError(err, errorParams);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(getParentListFailure(err));
      dispatch(removeLoader('getParentList'));
      return err;
    });
};

export const getParentListRequest = () => {
  return {
    type: 'PARENT_LIST_GET_REQUEST',
  };
};

export const getParentListSuccess = (responseData) => {
  return {
    type: 'PARENT_LIST_GET_SUCCESS',
    payload: responseData,
  };
};

export const getParentListFailure = (error) => {
  return {
    type: 'PARENT_LIST_GET_FAILURE',
    payload: error,
  };
};
