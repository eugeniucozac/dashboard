import { authLogout } from 'stores';
import * as utils from 'utils';

export const getParentOfficeListAll = () => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}} = getState();

  const defaultError = {
    file: 'stores/admin.actions.getParentOfficeListAll',
  };

  dispatch(getParentOfficeListAllRequest());

  return utils.api
    .get({
      token: auth.accessToken,
      endpoint: endpoint.edge,
      path: 'api/client/parent/all/offices',
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleData(json))
    .then((data) => {
      dispatch(getParentOfficeListAllSuccess(data));
    })
    .catch((err) => {
      utils.api.handleError(err, defaultError);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(getParentOfficeListAllFailure(err));
      return err;
    });
};

export const getParentOfficeListAllRequest = () => {
  return {
    type: 'ADMIN_PARENT_OFFICE_LIST_ALL_GET_REQUEST',
  };
};

export const getParentOfficeListAllSuccess = (payload) => {
  return {
    type: 'ADMIN_PARENT_OFFICE_LIST_ALL_GET_SUCCESS',
    payload,
  };
};

export const getParentOfficeListAllFailure = (error) => {
  return {
    type: 'ADMIN_PARENT_OFFICE_LIST_ALL_GET_FAILURE',
    payload: error,
  };
};
