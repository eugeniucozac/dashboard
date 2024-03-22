import { addLoader, authLogout, removeLoader } from 'stores';
import * as utils from 'utils';

export const getDepartmentMarkets = (deptId) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}} = getState();

  const defaultError = {
    file: 'stores/department.actions.getMarkets',
  };

  dispatch(getDepartmentMarketsRequest(deptId));
  dispatch(addLoader('getDepartmentMarkets'));

  if (!deptId) {
    dispatch(getDepartmentMarketsFailure({ ...defaultError, message: 'Missing department ID' }));
    dispatch(removeLoader('getDepartmentMarkets'));
    return;
  }

  return utils.api
    .get({
      token: auth.accessToken,
      endpoint: endpoint.edge,
      path: `api/departmentMarket/department/${deptId}`,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleData(json))
    .then((data) => {
      dispatch(getDepartmentMarketsSuccess(data));
      return data;
    })
    .catch((err) => {
      utils.api.handleError(err, defaultError);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(getDepartmentMarketsFailure(err));
      return err;
    })
    .finally(() => {
      dispatch(removeLoader('getDepartmentMarkets'));
    });
};

export const getDepartmentMarketsRequest = (deptId) => {
  return {
    type: 'DEPARTMENT_MARKETS_LIST_GET_REQUEST',
    payload: deptId,
  };
};

export const getDepartmentMarketsSuccess = (data) => {
  return {
    type: 'DEPARTMENT_MARKETS_LIST_GET_SUCCESS',
    payload: data,
  };
};

export const getDepartmentMarketsFailure = (error) => {
  return {
    type: 'DEPARTMENT_MARKETS_LIST_GET_FAILURE',
    payload: error,
  };
};
