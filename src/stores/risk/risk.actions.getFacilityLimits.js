import { authLogout } from 'stores';
import * as utils from 'utils';

export const getFacilityLimits = (facilityId) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint } } } = getState();

  const defaultError = {
    file: 'stores/risk.actions.getFacilityLimits',
  };

  dispatch(getFacilityLimitReq(facilityId));

  if (!facilityId) {
    dispatch(getFacilityLimitFailure(defaultError));
    return;
  }

  return utils.api
    .get({
      token: auth.accessToken,
      endpoint: endpoint.auth,
      path: `api/v1/limits?facilityId=${facilityId}`,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => {
      return utils.api.handleResponseJsonObject(json);
    })
    .then((data) => {
      dispatch(getFacilityLimitSuccess(data));
      return data;
    })
    .catch((err) => {
      utils.api.handleError(err, defaultError);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(getFacilityLimitFailure(err, facilityId));
      return err;
    });
};

export const getFacilityLimitReq = (facilityId) => {
  return {
    type: 'RISK_FACILITY_LIMIT_GET_REQUEST',
    payload: facilityId,
  };
};

export const getFacilityLimitSuccess = (data) => {
  return {
    type: 'RISK_FACILITY_LIMIT_GET_SUCCESS',
    payload: data,
  };
};

export const getFacilityLimitFailure = (error, facilityId) => {
  return {
    type: 'RISK_FACILITY_LIMIT_GET_FAILURE',
    payload: { error, facilityId },
  };
};
