import * as utils from 'utils';
import { authLogout } from 'stores';

export const getTripAddresses = (searchTerm) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}} = getState();

  dispatch(getTripAddressesRequest(searchTerm));

  const body = {
    address: searchTerm,
  };

  return utils.api
    .post({
      token: auth.accessToken,
      endpoint: endpoint.location,
      path: 'api/search',
      data: body,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleData(json))
    .then((data) => {
      dispatch(getTripAddressesSuccess(data));

      // last then to return updated state data to components waiting for this promise
      // ex: async Autocomplete (React-Select)
      return getState().trip.addresses.filter((address) => address.lat && address.lng);
    })
    .catch((err) => {
      const errorParams = {
        file: 'stores/trip.actions.getTripAddresses',
        message: 'API fetch error (trip.getTripAddresses)',
      };

      utils.api.handleError(err, errorParams);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(getTripAddressesFailure(err));
      return err;
    });
};

export const getTripAddressesRequest = (searchTerm) => {
  return {
    type: 'TRIP_ADDRESSES_GET_REQUEST',
    payload: searchTerm,
  };
};

export const getTripAddressesSuccess = (responseData) => {
  return {
    type: 'TRIP_ADDRESSES_GET_SUCCESS',
    payload: responseData,
  };
};

export const getTripAddressesFailure = (error) => {
  return {
    type: 'TRIP_ADDRESSES_GET_FAILURE',
    payload: error,
  };
};
