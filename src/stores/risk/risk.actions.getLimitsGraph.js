import { authLogout } from 'stores';
import * as utils from 'utils';

export const getAggregateLimitsGraph = (facilityId) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint } } } = getState();

  const defaultError = {
    file: 'stores/risk.actions.getAggregateLimitsGraph',
  };

  dispatch(getAggLimitsGraphRequest(facilityId));

  if (!facilityId) {
    dispatch(getAggLimitsGraphFailure(defaultError));
    return;
  }

  return utils.api
    .get({
      token: auth.accessToken,
      endpoint: endpoint.auth,
      path: `api/v1/facilities/${facilityId}/aggregate-limits`,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => {
      dispatch(getAggLimitsGraphSuccess(json.aggregateFieldLimits));
    })
    .catch((err) => {
      utils.api.handleError(err, defaultError);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(getAggLimitsGraphFailure(err, facilityId));
      return err;
    });
};

export const getAggLimitsGraphRequest = (facilityId) => {
  return {
    type: 'RISK_FACILITY_AGGREGATE_LIMITS_GRAPH_GET_REQUEST',
    payload: facilityId,
  };
};

export const getAggLimitsGraphSuccess = (data) => {
  return {
    type: 'RISK_FACILITY_AGGREGATE_LIMITS_GRAPH_GET_SUCCESS',
    payload: data,
  };
};

export const getAggLimitsGraphFailure = (error, facilityId) => {
  return {
    type: 'RISK_FACILITY_AGGREGATE_LIMITS_GRAPH_GET_FAILURE',
    payload: { error, facilityId },
  };
};
