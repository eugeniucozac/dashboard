import { authLogout } from 'stores';
import * as utils from 'utils';

export const getRiskCountries = () => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}} = getState();

  const defaultError = {
    file: 'stores/risk.actions.getRiskCountries',
  };

  dispatch(getRiskCountriesRequest());

  return utils.api
    .get({
      token: auth.accessToken,
      endpoint: endpoint.auth,
      path: 'api/v1/facilities/countries',
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleResponseJsonArray(json))
    .then((data) => {
      dispatch(getRiskCountriesSuccess(data));
      return data;
    })
    .catch((err) => {
      utils.api.handleError(err, defaultError);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(getRiskCountriesFailure(err));
      return err;
    });
};

export const getRiskCountriesRequest = () => {
  return {
    type: 'RISK_COUNTRIES_GET_REQUEST',
  };
};

export const getRiskCountriesSuccess = (data) => {
  return {
    type: 'RISK_COUNTRIES_GET_SUCCESS',
    payload: data,
  };
};

export const getRiskCountriesFailure = (error) => {
  return {
    type: 'RISK_COUNTRIES_GET_FAILURE',
    payload: error,
  };
};
