import omit from 'lodash/omit';
import get from 'lodash/get';

// app
import { addLoader, authLogout, enqueueNotification, removeLoader } from 'stores';
import * as utils from 'utils';

export const putTrip = () => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}} = getState();

  const defaultError = {
    file: 'stores/trip.actions.putTrip',
    message: 'Data missing for PUT request',
  };

  const state = getState();
  const tripSelected = get(state, 'trip.selected') || {};
  const tripEditingInProgress = get(state, 'trip.editingInProgress') || {};
  const trip = tripSelected.editing ? { ...tripSelected, ...tripEditingInProgress } : tripSelected;
  const visits = trip.visits || [];

  dispatch(putTripRequest(trip.id));
  dispatch(addLoader('putTrip'));

  if (!trip.id) {
    dispatch(putTripFailure(defaultError));
    dispatch(enqueueNotification('notification.editTrip.fail', 'error'));
    dispatch(removeLoader('putTrip'));
    return;
  }

  // get the data for PUT
  const body = {
    ...omit(trip, ['visits']),
    visit: visits.map((visit) => {
      if (visit.isExistingLeadVisit) {
        return omit(visit, ['isExistingLeadVisit', 'isNewVisit']);
      }

      if (visit.isNewVisit) {
        return omit(visit, ['isNewVisit', 'id']);
      }

      return visit;
    }),
  };

  return utils.api
    .put({
      token: auth.accessToken,
      endpoint: endpoint.edge,
      path: 'api/trip',
      data: body,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleData(json))
    .then((data) => {
      dispatch(putTripSuccess(data));
      dispatch(enqueueNotification('notification.editTrip.success', 'success'));
    })
    .catch((err) => {
      const errorParams = {
        ...defaultError,
        message: 'API post error (trip.putTrip)',
      };

      utils.api.handleError(err, errorParams);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(putTripFailure(err));
      dispatch(enqueueNotification('notification.editTrip.fail', 'error'));
      return err;
    })
    .finally(() => {
      dispatch(removeLoader('putTrip'));
    });
};

export const putTripRequest = (formData) => {
  return {
    type: 'TRIP_PUT_REQUEST',
    payload: formData,
  };
};

export const putTripSuccess = (responseData) => {
  return {
    type: 'TRIP_PUT_SUCCESS',
    payload: responseData,
  };
};

export const putTripFailure = (error) => {
  return {
    type: 'TRIP_PUT_FAILURE',
    payload: error,
  };
};
