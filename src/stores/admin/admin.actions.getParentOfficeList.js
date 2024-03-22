import { addLoader, authLogout, removeLoader } from 'stores';
import * as utils from 'utils';

export const getParentOfficeList =
  (params = {}) =>
  (dispatch, getState) => {
    // prettier-ignore
    const { user: { auth }, config: { vars: { endpoint }}, admin} = getState();
    const { name, page, size } = params;

    const defaultError = {
      file: 'stores/admin.actions.getParentOfficeList',
    };

    const endpointParams = {
      page: page || 1,
      size: size || admin.parentOfficeList.pageSize,
      orderBy: admin.parentOfficeList.sortBy,
      direction: admin.parentOfficeList.sortDirection,
      ...(name && { name }),
    };

    dispatch(getParentOfficeListRequest({ endpointParams }));

    dispatch(addLoader('getParentOfficeList'));

    return utils.api
      .get({
        token: auth.accessToken,
        endpoint: endpoint.edge,
        path: `api/client/parent/paginated/offices`,
        params: endpointParams,
      })
      .then((response) => utils.api.handleResponse(response))
      .then((json) => utils.api.handleData(json))
      .then((data) => {
        dispatch(getParentOfficeListSuccess(data));
      })
      .catch((err) => {
        utils.api.handleError(err, defaultError);
        utils.api.handleUnauthorized(err, dispatch, authLogout);
        dispatch(getParentOfficeListFailure(err));
        return err;
      })
      .finally(() => {
        dispatch(removeLoader('getParentOfficeList'));
      });
  };

export const getParentOfficeListRequest = (payload) => {
  return {
    type: 'ADMIN_PARENT_OFFICE_LIST_GET_REQUEST',
    payload,
  };
};

export const getParentOfficeListSuccess = (payload) => {
  return {
    type: 'ADMIN_PARENT_OFFICE_LIST_GET_SUCCESS',
    payload,
  };
};

export const getParentOfficeListFailure = (error) => {
  return {
    type: 'ADMIN_PARENT_OFFICE_LIST_GET_FAILURE',
    payload: error,
  };
};
