// app
import { authLogout, removeLoader } from 'stores';
import * as utils from 'utils';

export const getCoverageDefinition = (product, type) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint } } } = getState();

  const defaultError = {
    file: 'stores/risk.actions.getCoverageDefinition',
  };

  dispatch(getCoverageDefinitionRequest(type));

  if (!product || !type) {
    dispatch(getCoverageDefinitionFailure(defaultError));
    dispatch(removeLoader('getCoverageDefinition'));
    return;
  }

  return utils.api
    .get({
      token: auth.accessToken,
      endpoint: endpoint.auth,
      path: `api/v1/products/${product}?type=${type}`,
    })

    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleData(json))
    .then((data) => {
      dispatch(getCoverageDefinitionSuccess(product, data));
    })
    .catch((err) => {
      utils.api.handleError(err, defaultError);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(getCoverageDefinitionFailure(err));
      return err;
    });
};

export const getCoverageDefinitionRequest = (type) => {
  return {
    type: 'COVERAGE_DEFINITIONS_GET_REQUEST',
    payload: type,
  };
};

export const getCoverageDefinitionSuccess = (product, data) => {
  return {
    type: 'COVERAGE_DEFINITIONS_GET_SUCCESS',
    payload: { product, definition: data.product },
  };
};

export const getCoverageDefinitionFailure = (error) => {
  return {
    type: 'COVERAGE_DEFINITIONS_GET_FAILURE',
    payload: error,
  };
};
