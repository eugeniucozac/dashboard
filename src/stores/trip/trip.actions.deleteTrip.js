import { addLoader, authLogout, enqueueNotification, hideModal, removeLoader } from 'stores';
import * as utils from 'utils';

export const deleteTrip = (id) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}} = getState();

  const defaultError = {
    file: 'stores/trip.actions.deleteTrip',
    message: 'Data missing for DELETE request',
  };

  dispatch(deleteTripRequest(id));
  dispatch(addLoader('deleteTrip'));

  if (!id) {
    dispatch(deleteTripFailure(defaultError));
    dispatch(enqueueNotification('notification.deleteTrip.fail', 'error'));
    dispatch(hideModal());
    dispatch(removeLoader('deleteTrip'));
    return;
  }

  return utils.api
    .delete({
      token: auth.accessToken,
      endpoint: endpoint.edge,
      path: `api/trip/${id}`,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleData(json))
    .then((data) => {
      dispatch(deleteTripSuccess(id));
      dispatch(enqueueNotification('notification.deleteTrip.success', 'success'));
      dispatch(hideModal());
      dispatch(removeLoader('deleteTrip'));
    })
    .catch((err) => {
      const errorParams = {
        ...defaultError,
        message: 'API delete error (trip.deleteTrip)',
      };

      utils.api.handleError(err, errorParams);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(deleteTripFailure(err));
      dispatch(enqueueNotification('notification.deleteTrip.fail', 'error'));
      dispatch(hideModal());
      dispatch(removeLoader('deleteTrip'));
      return err;
    });
};

export const deleteTripRequest = (id) => {
  return {
    type: 'TRIP_DELETE_REQUEST',
    payload: id,
  };
};

export const deleteTripSuccess = (id) => {
  return {
    type: 'TRIP_DELETE_SUCCESS',
    payload: id,
  };
};

export const deleteTripFailure = (error) => {
  return {
    type: 'TRIP_DELETE_FAILURE',
    payload: error,
  };
};
