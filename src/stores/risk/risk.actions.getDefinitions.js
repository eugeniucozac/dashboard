// app
import { authLogout } from 'stores';
import * as utils from 'utils';

export const getRiskDefinitions = (type) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}} = getState();

  const defaultError = {
    file: 'stores/risk.actions.getDefinitions',
  };

  dispatch(getDefinitionsRequest(type));

  return utils.api
    .get({
      token: auth.accessToken,
      endpoint: endpoint.auth,
      path: `api/v1/products/${type}`,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleData(json))
    .then((data) => dispatch(getDefinitionsSuccess(type, data)))
    .catch((err) => {
      utils.api.handleError(err, defaultError);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(getDefinitionsFailure(err));
      return err;
    });
};

export const getDefinitionsRequest = (type) => {
  return {
    type: 'RISK_DEFINITIONS_GET_REQUEST',
    payload: type,
  };
};

export const getDefinitionsSuccess = (type, data) => {
  return {
    type: 'RISK_DEFINITIONS_GET_SUCCESS',
    payload: {
      type,
      data,
    },
  };
};

export const getDefinitionsFailure = (error) => {
  return {
    type: 'RISK_DEFINITIONS_GET_FAILURE',
    payload: error,
  };
};
