// app
import { authLogout } from 'stores';
import * as utils from 'utils';

export const getRiskProductsWithReports = () => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}} = getState();

  const defaultError = {
    file: 'stores/risk.actions.getRiskProductsWithReports',
  };

  dispatch(getProductsWithReportsRequest());

  return utils.api
    .get({
      token: auth.accessToken,
      endpoint: endpoint.auth,
      path: 'api/v1/products/reports',
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleData(json))
    .then((data) => {
      dispatch(getProductsWithReportsSuccess(data));
      return data;
    })
    .catch((err) => {
      utils.api.handleError(err, defaultError);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(getProductsWithReportsFailure(err));
      return err;
    });
};

export const getProductsWithReportsRequest = () => {
  return {
    type: 'RISK_PRODUCTS_REPORTS_GET_REQUEST',
  };
};

export const getProductsWithReportsSuccess = (data) => {
  return {
    type: 'RISK_PRODUCTS_REPORTS_GET_SUCCESS',
    payload: data,
  };
};

export const getProductsWithReportsFailure = (error) => {
  return {
    type: 'RISK_PRODUCTS_REPORTS_GET_FAILURE',
    payload: error,
  };
};
