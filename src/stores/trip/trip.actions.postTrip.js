import omit from 'lodash/omit';
import get from 'lodash/get';

// app
import { addLoader, authLogout, enqueueNotification, removeLoader } from 'stores';
import * as utils from 'utils';

export const postTrip = () => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}} = getState();

  const defaultError = {
    file: 'stores/trip.actions.postTrip',
    message: 'Data missing for POST request',
  };

  const state = getState();
  const tripSelected = get(state, 'trip.selected');
  const tripEditingInProgress = get(state, 'trip.editingInProgress') || {};
  const trip = tripSelected.editing ? { ...tripSelected, ...tripEditingInProgress } : tripSelected;
  const visits = trip.visits || [];

  dispatch(postTripRequest(trip));
  dispatch(addLoader('postTrip'));

  if (!trip || !trip.title || !utils.generic.isValidArray(trip.visits, true)) {
    dispatch(postTripFailure(defaultError));
    dispatch(enqueueNotification('notification.saveTrip.fail', 'error'));
    dispatch(removeLoader('postTrip'));
    return;
  }

  // get the data for POST
  const body = {
    ...omit(trip, ['visits']),
    visit: visits.map((visit) => {
      // if the visit is an existing visit (lead with a saved trip/visit already existing):
      //   - keep the (visit) ID
      //   - remove the isExistingLeadVisit property
      //
      // if the visit is new:
      //   - remove the (lead) ID (not to be confused with a real visit ID)
      return visit.isExistingLeadVisit ? omit(visit, ['isExistingLeadVisit']) : omit(visit, ['id']);
    }),
  };

  return utils.api
    .post({
      token: auth.accessToken,
      endpoint: endpoint.edge,
      path: 'api/trip',
      data: body,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleData(json))
    .then((data) => {
      dispatch(postTripSuccess(data));
      dispatch(enqueueNotification('notification.saveTrip.success', 'success'));
    })
    .catch((err) => {
      const errorParams = {
        ...defaultError,
        message: 'API post error (trip.postTrip)',
      };

      utils.api.handleError(err, errorParams);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(postTripFailure(err));
      dispatch(enqueueNotification('notification.saveTrip.fail', 'error'));
      return err;
    })
    .finally(() => {
      dispatch(removeLoader('postTrip'));
    });
};

export const postTripRequest = (formData) => {
  return {
    type: 'TRIP_POST_REQUEST',
    payload: formData,
  };
};

export const postTripSuccess = (responseData) => {
  return {
    type: 'TRIP_POST_SUCCESS',
    payload: responseData,
  };
};

export const postTripFailure = (error) => {
  return {
    type: 'TRIP_POST_FAILURE',
    payload: error,
  };
};
