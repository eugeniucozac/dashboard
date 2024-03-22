import { addLoader, authLogout, removeLoader } from 'stores';
import * as utils from 'utils';

export const getDepartmentMarket = (deptMarketId) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}} = getState();

  const defaultError = {
    file: 'stores/department.actions.getMarket',
  };

  dispatch(getDepartmentMarketRequest(deptMarketId));
  dispatch(addLoader('getDepartmentMarket'));

  if (!deptMarketId) {
    dispatch(getDepartmentMarketFailure({ ...defaultError, message: 'Missing department market ID' }));
    dispatch(removeLoader('getDepartmentMarket'));
    return;
  }

  return utils.api
    .get({
      token: auth.accessToken,
      endpoint: endpoint.edge,
      path: `api/departmentMarket/${deptMarketId}`,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleData(json))
    .then((data) => {
      dispatch(getDepartmentMarketSuccess(data));
      return data;
    })
    .catch((err) => {
      utils.api.handleError(err, defaultError);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(getDepartmentMarketFailure(err));
      return err;
    })
    .finally(() => {
      dispatch(removeLoader('getDepartmentMarket'));
    });
};

export const getDepartmentMarketRequest = (deptMarketId) => {
  return {
    type: 'DEPARTMENT_MARKET_GET_REQUEST',
    payload: deptMarketId,
  };
};

export const getDepartmentMarketSuccess = (data) => {
  return {
    type: 'DEPARTMENT_MARKET_GET_SUCCESS',
    payload: data,
  };
};

export const getDepartmentMarketFailure = (error) => {
  return {
    type: 'DEPARTMENT_MARKET_GET_FAILURE',
    payload: error,
  };
};
