import { authLogout } from 'stores';
import * as utils from 'utils';

export const getFacilityRates = (facilityId) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}} = getState();

  const defaultError = {
    file: 'stores/risk.actions.getFacilityRates',
  };

  dispatch(getFacilityRatesRequest(facilityId));

  if (!facilityId) {
    dispatch(getFacilityRatesFailure(defaultError));
    return;
  }

  return utils.api
    .get({
      token: auth.accessToken,
      endpoint: endpoint.auth,
      path: `api/v1/rates?facilityId=${facilityId}`,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleResponseJsonObject(json))
    .then((data) => {
      dispatch(getFacilityRatesSuccess(data));
      return data;
    })
    .catch((err) => {
      utils.api.handleError(err, defaultError);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(getFacilityRatesFailure(err, facilityId));
      return err;
    });
};

export const getFacilityRatesRequest = (facilityId) => {
  return {
    type: 'RISK_FACILITY_RATES_GET_REQUEST',
    payload: facilityId,
  };
};

export const getFacilityRatesSuccess = (data) => {
  return {
    type: 'RISK_FACILITY_RATES_GET_SUCCESS',
    payload: data,
  };
};

export const getFacilityRatesFailure = (error, facilityId) => {
  return {
    type: 'RISK_FACILITY_RATES_GET_FAILURE',
    payload: { error, facilityId },
  };
};
