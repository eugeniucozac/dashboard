import { addLoader, authLogout, removeLoader } from 'stores';
import * as utils from 'utils';

export const getUserList =
  (params = {}) =>
  (dispatch, getState) => {
    // prettier-ignore
    const { user: { auth }, config: { vars: { endpoint }}} = getState();
    const { departmentId, fullName, page, size } = params;

    const defaultError = {
      file: 'stores/admin.actions.getUserList',
    };

    const admin = getState().admin;

    const endpointParams = {
      page: page || 1,
      size: size || admin.userList.pageSize,
      orderBy: admin.userList.sortBy,
      direction: admin.userList.sortDirection,
      ...(fullName && { fullName }),
    };

    dispatch(getUserListRequest({ departmentId, endpointParams }));
    dispatch(addLoader('getUserList'));

    return utils.api
      .get({
        token: auth.accessToken,
        endpoint: endpoint.edge,
        path: departmentId ? `api/user/department/${departmentId}` : 'api/user/all',
        params: endpointParams,
      })
      .then((response) => utils.api.handleResponse(response))
      .then((json) => utils.api.handleData(json))
      .then((data) => {
        dispatch(getUserListSuccess(data));
      })
      .catch((err) => {
        utils.api.handleError(err, defaultError);
        utils.api.handleUnauthorized(err, dispatch, authLogout);
        dispatch(getUserListFailure(err));
        return err;
      })
      .finally(() => {
        dispatch(removeLoader('getUserList'));
      });
  };

export const getUserListRequest = (payload) => {
  return {
    type: 'ADMIN_USER_LIST_GET_REQUEST',
    payload,
  };
};

export const getUserListSuccess = (payload) => {
  return {
    type: 'ADMIN_USER_LIST_GET_SUCCESS',
    payload,
  };
};

export const getUserListFailure = (error) => {
  return {
    type: 'ADMIN_USER_LIST_GET_FAILURE',
    payload: error,
  };
};
