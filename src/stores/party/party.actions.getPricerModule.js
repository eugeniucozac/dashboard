// app
import { authLogout } from 'stores';
import * as utils from 'utils';

export const getPricerModule = (productCode) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}} = getState();

  const defaultError = {
    file: 'stores/party.actions.getPricerModule',
  };

  dispatch(getPricerModuleRequest());

  return utils.api
    .get({
      token: auth.accessToken,
      endpoint: endpoint.auth,
      path: productCode ? `api/v1/facilities/modules?productCode=${productCode}` : 'api/v1/facilities/modules',
    })
    .then((response) => utils.api.handleResponse(response))
    .then((data) => {
      dispatch(getPricerModuleSuccess(data));
      return data;
    })
    .catch((err) => {
      utils.api.handleError(err, defaultError);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(getPricerModuleFailure(err));
      return err;
    });
};

export const getPricerModuleRequest = () => {
  return {
    type: 'PRICER_MODULE_GET_REQUEST',
  };
};

export const getPricerModuleSuccess = (payload) => {
  return {
    type: 'PRICER_MODULE_GET_SUCCESS',
    payload,
  };
};

export const getPricerModuleFailure = (error) => {
  return {
    type: 'PRICER_MODULE_GET_FAILURE',
    payload: error,
  };
};
