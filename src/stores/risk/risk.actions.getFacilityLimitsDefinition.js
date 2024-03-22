import { authLogout } from 'stores';
import * as utils from 'utils';

export const getFacilityLimitsDefinition = (facilityId, productCode) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint } } } = getState();

  const defaultError = {
    file: 'stores/risk.actions.getFacilityLimitsDefinition',
  };

  dispatch(getFacilityLimitsRequest(facilityId));

  if (!facilityId || !productCode) {
    dispatch(getFacilityLimitsFailure(defaultError));
    return;
  }

  return utils.api
    .get({
      token: auth.accessToken,
      endpoint: endpoint.auth,
      path: `api/v1/products/${productCode}?type=LIMIT_APPLICABLE&facilityId=${facilityId}`,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => {
      dispatch(getFacilityLimitsSuccess(json.data));
    })
    .catch((err) => {
      utils.api.handleError(err, defaultError);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(getFacilityLimitsFailure(err, facilityId));
      return err;
    });
};

export const getFacilityLimitsRequest = (facilityId) => {
  return {
    type: 'RISK_FACILITY_LIMITS_DEF_GET_REQUEST',
    payload: facilityId,
  };
};

export const getFacilityLimitsSuccess = (data) => {
  return {
    type: 'RISK_FACILITY_LIMITS_DEF_GET_SUCCESS',
    payload: data?.product,
  };
};

export const getFacilityLimitsFailure = (error, facilityId) => {
  return {
    type: 'RISK_FACILITY_LIMITS_DEF_GET_FAILURE',
    payload: { error, facilityId },
  };
};
