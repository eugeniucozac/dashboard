import get from 'lodash/get';

// app
import { addLoader, authLogout, enqueueNotification, removeLoader } from 'stores';
import * as utils from 'utils';

export const deletePlacementLocations = () => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}} = getState();

  const defaultError = {
    file: 'stores/placement.actions.locations',
  };

  const placementId = get(getState(), 'placement.selected.id');

  dispatch(deletePlacementLocationsRequest(placementId));
  dispatch(addLoader('deletePlacementLocations'));

  if (!placementId) {
    dispatch(deletePlacementLocationsSuccess(defaultError));
    dispatch(enqueueNotification('notification.deleteLocations.fail', 'error'));
    dispatch(removeLoader('deletePlacementLocations'));
    return;
  }

  return utils.api
    .delete({
      token: auth.accessToken,
      endpoint: endpoint.location,
      path: `api/locations/${placementId}`,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleData(json))
    .then((data) => {
      dispatch(deletePlacementLocationsSuccess(data));
      dispatch(resetPlacementLocations());
      dispatch(enqueueNotification('notification.deleteLocations.success', 'success'));
      dispatch(removeLoader('deletePlacementLocations'));
    })
    .catch((err) => {
      const errorParams = {
        ...defaultError,
        message: 'API delete error (placement.locations)',
      };

      utils.api.handleError(err, errorParams);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(deletePlacementLocationsFailure(err));
      dispatch(enqueueNotification('notification.deleteLocations.fail', 'error'));
      dispatch(removeLoader('deletePlacementLocations'));
      return err;
    });
};

export const deletePlacementLocationsRequest = (placementId) => {
  return {
    type: 'PLACEMENT_LOCATIONS_DELETE_REQUEST',
    payload: placementId,
  };
};

export const deletePlacementLocationsSuccess = (data) => {
  return {
    type: 'PLACEMENT_LOCATIONS_DELETE_SUCCESS',
    payload: data,
  };
};

export const deletePlacementLocationsFailure = (error) => {
  return {
    type: 'PLACEMENT_LOCATIONS_DELETE_FAILURE',
    payload: error,
  };
};

export const resetPlacementLocations = () => {
  return {
    type: 'PLACEMENT_LOCATIONS_RESET',
  };
};
