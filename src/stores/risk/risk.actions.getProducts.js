// app
import { authLogout } from 'stores';
import * as utils from 'utils';

export const getRiskProducts = () => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}} = getState();

  const defaultError = {
    file: 'stores/risk.actions.getProducts',
  };

  dispatch(getProductsRequest());

  return utils.api
    .get({
      token: auth.accessToken,
      endpoint: endpoint.auth,
      path: 'api/v1/products',
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleData(json))
    .then((data) => {
      dispatch(getProductsSuccess(data));
      return data;
    })
    .catch((err) => {
      utils.api.handleError(err, defaultError);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(getProductsFailure(err));
      return err;
    });
};

export const getProductsRequest = () => {
  return {
    type: 'RISK_PRODUCTS_GET_REQUEST',
  };
};

export const getProductsSuccess = (data) => {
  return {
    type: 'RISK_PRODUCTS_GET_SUCCESS',
    payload: data,
  };
};

export const getProductsFailure = (error) => {
  return {
    type: 'RISK_PRODUCTS_GET_FAILURE',
    payload: error,
  };
};
