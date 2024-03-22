import * as utils from 'utils';
import { authLogout } from 'stores';

export const getTripLeads = (lat, lng) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}} = getState();

  dispatch(getTripLeadsRequest(lat, lng));

  return utils.api
    .get({
      token: auth.accessToken,
      endpoint: endpoint.edge,
      path: `api/client/search/${lat}/${lng}/100`,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleData(json))
    .then((data) => {
      dispatch(getTripLeadsSuccess(data));

      // last then to return updated state data to components waiting for this promise
      // ex: async Autocomplete (React-Select)
      return getState().trip.leads;
    })
    .catch((err) => {
      const errorParams = {
        file: 'stores/trip.actions.getTripLeads',
        message: 'API fetch error (trip.getTripLeads)',
      };

      utils.api.handleError(err, errorParams);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(getTripLeadsFailure(err));
      return err;
    });
};

export const getTripLeadsRequest = (lat, lng) => {
  return {
    type: 'TRIP_LEADS_GET_REQUEST',
    payload: { lat, lng },
  };
};

export const getTripLeadsSuccess = (responseData) => {
  return {
    type: 'TRIP_LEADS_GET_SUCCESS',
    payload: responseData,
  };
};

export const getTripLeadsFailure = (error) => {
  return {
    type: 'TRIP_LEADS_GET_FAILURE',
    payload: error,
  };
};
