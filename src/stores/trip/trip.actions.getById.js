import { addLoader, authLogout, removeLoader, resetTripSelected } from 'stores';
import * as utils from 'utils';

export const getTripById = (id, showLoader) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}} = getState();

  const defaultError = {
    file: 'stores/trip.actions.getById',
  };

  dispatch(getTripByIdRequest(id));

  if (showLoader) {
    dispatch(addLoader('getTripById'));
  }

  return utils.api
    .get({
      token: auth.accessToken,
      endpoint: endpoint.edge,
      path: `api/trip/${id}`,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleData(json))
    .then((data) => {
      dispatch(getTripByIdSuccess(data));
      return data;
    })
    .catch((err) => {
      utils.api.handleError(err, defaultError);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(resetTripSelected());
      dispatch(getTripByIdFailure(err));
      return err;
    })
    .finally(() => {
      if (showLoader) {
        dispatch(removeLoader('getTripById'));
      }
    });
};

export const getTripByIdRequest = (id) => {
  return {
    type: 'TRIP_BY_ID_GET_REQUEST',
    payload: id,
  };
};

export const getTripByIdSuccess = (data) => {
  return {
    type: 'TRIP_BY_ID_GET_SUCCESS',
    payload: data,
  };
};

export const getTripByIdFailure = (error) => {
  return {
    type: 'TRIP_BY_ID_GET_FAILURE',
    payload: error,
  };
};
