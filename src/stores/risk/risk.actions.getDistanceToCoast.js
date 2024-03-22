import * as utils from 'utils';
import { authLogout } from 'stores';

export const getDistanceToCoast = (location) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}} = getState();

  dispatch(getDistanceToCoastRequest(location));

  const { lng, lat } = location;

  const params = {
    lng,
    lat,
  };

  return utils.api
    .get({
      token: auth.accessToken,
      endpoint: endpoint.dtc,
      path: 'api/distance-to-coast',
      params,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((data) => {
      dispatch(getDistanceToCoastSuccess(data));
      return data;
    })
    .catch((err) => {
      const errorParams = {
        file: 'stores/risk.actions.getDistanceToCoast',
        message: 'API fetch error (risk.getDistanceToCoast)',
      };

      utils.api.handleError(err, errorParams);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(getDistanceToCoastFailure(err));
      return err;
    });
};

export const getDistanceToCoastRequest = (searchTerm) => {
  return {
    type: 'RISK_ADDRESS_DTC_GET_REQUEST',
    payload: searchTerm,
  };
};

export const getDistanceToCoastSuccess = (responseData) => {
  return {
    type: 'RISK_ADDRESS_DTC_GET_SUCCESS',
    payload: responseData,
  };
};

export const getDistanceToCoastFailure = (error) => {
  return {
    type: 'RISK_ADDRESS_DTC_GET_FAILURE',
    payload: error,
  };
};
