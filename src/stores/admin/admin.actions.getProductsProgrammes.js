// app
import { authLogout } from 'stores';
import * as utils from 'utils';

export const getProductsProgrammes = () => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}} = getState();

  const defaultError = {
    file: 'stores/admin.actions.getProductsProgrammes',
  };

  dispatch(getProductsProgrammesRequest());

  const path = `api/v1/products/edge`;

  return utils.api
    .get({
      token: auth.accessToken,
      endpoint: endpoint.auth,
      path,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleData(json))
    .then((data) => {
      dispatch(getProductsProgrammesSuccess(data));
      return data;
    })
    .catch((err) => {
      utils.api.handleError(err, defaultError);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(getProductsProgrammesFailure(err));
      return err;
    });
};

export const getProductsProgrammesRequest = () => {
  return {
    type: 'PRODUCTS_PROGRAMMES_GET_REQUEST',
  };
};

export const getProductsProgrammesSuccess = (data) => {
  return {
    type: 'PRODUCTS_PROGRAMMES_GET_SUCCESS',
    payload: data,
  };
};

export const getProductsProgrammesFailure = (error) => {
  return {
    type: 'PRODUCTS_PROGRAMMES_GET_FAILURE',
    payload: error,
  };
};
