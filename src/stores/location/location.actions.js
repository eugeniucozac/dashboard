import get from 'lodash/get';
import orderBy from 'lodash/orderBy';

// app
import { addLoader, authLogout, enqueueNotification, hideModal, removeLoader } from 'stores';
import * as utils from 'utils';

export const postNewLocationGroup = () => (dispatch, getState) => {
  // prettier-ignore
  const { user, config: { vars: { endpoint }}} = getState();
  const { auth } = user;

  const defaultError = {
    file: 'stores/location.actions',
  };

  const state = getState();
  const placementId = get(state, 'placement.selected.id');
  const locationsUploaded = get(state, 'location.locationsUploaded', []);

  dispatch({ type: 'LOCATION_POST_NEW_GROUP', payload: locationsUploaded });
  dispatch(addLoader('postNewLocationGroup'));

  if (!placementId) defaultError.title = 'Missing placement selected ID';
  if (!user.emailId) defaultError.title = 'Missing user email ID';
  if (!auth.accessToken) defaultError.title = 'Missing user access token';

  if (!placementId || !user.emailId || !auth.accessToken) {
    dispatch({ type: 'LOCATION_POST_NEW_GROUP_FAILURE', payload: defaultError });
    dispatch(removeLoader('postNewLocationGroup'));
    return;
  }

  const body = {
    placementId: placementId,
    uploaderEmail: user.emailId,
    locations: locationsUploaded,
  };

  return utils.api
    .post({
      token: auth.accessToken,
      endpoint: endpoint.location,
      path: 'api/locations',
      data: body,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleData(json))
    .then((data) => {
      dispatch({ type: 'LOCATION_POST_NEW_GROUP_SUCCESS', payload: data });
      dispatch(hideModal());
      dispatch(getLocationGroupsForPlacement(placementId));
      dispatch(removeLoader('postNewLocationGroup'));
      dispatch(enqueueNotification('notification.location.success', 'success'));
    })
    .catch((err) => {
      const errorParams = {
        ...defaultError,
        title: 'API post error (location)',
      };

      dispatch({ type: 'LOCATION_POST_NEW_GROUP_FAILURE', payload: err });
      utils.api.handleError(err, errorParams);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(hideModal());
      dispatch(removeLoader('postNewLocationGroup'));
      dispatch(enqueueNotification('notification.location.fail', 'error'));
      return err;
    })
    .finally(() => {
      dispatch({ type: 'LOCATION_SET_UPLOAD_WIZARD_HEADER_MAP_RESET' });
    });
};

export const getLocationGroupsForPlacement = (placementId, showLoader) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}} = getState();

  const defaultError = {
    file: 'stores/location.actions',
  };

  dispatch({ type: 'LOCATION_GET_PLACEMENT_GROUPS', payload: placementId });

  if (showLoader) {
    dispatch(addLoader('getLocationGroupsForPlacement'));
  }

  if (!placementId) defaultError.title = 'Missing placement selected ID';
  if (!auth.accessToken) defaultError.title = 'Missing user access token';

  if (!placementId || !auth.accessToken) {
    dispatch({ type: 'LOCATION_GET_PLACEMENT_GROUPS_FAILURE', payload: defaultError });
    return;
  }

  return utils.api
    .get({
      token: auth.accessToken,
      endpoint: endpoint.location,
      path: `api/locations/${placementId}`,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleData(json))
    .then((data) => {
      dispatch({ type: 'LOCATION_GET_PLACEMENT_GROUPS_SUCCESS', payload: data });

      if (showLoader) {
        dispatch(removeLoader('getLocationGroupsForPlacement'));
      }

      dispatch(setLocationGroups(placementId, data));
    })
    .catch((err) => {
      const errorParams = {
        ...defaultError,
        title: 'API get error (locations)',
      };

      dispatch({ type: 'LOCATION_GET_PLACEMENT_GROUPS_FAILURE', payload: err });

      if (showLoader) {
        dispatch(removeLoader('getLocationGroupsForPlacement'));
      }

      utils.api.handleError(err, errorParams);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      return err;
    });
};

export const setLocationGroups = (placementId, locationGroups) => (dispatch, getState) => {
  const defaultError = {
    file: 'stores/location.actions',
    title: 'Too many attempts fetching geocoding for locations',
  };

  dispatch({ type: 'LOCATION_SET_GROUPS', payload: { id: placementId, groups: locationGroups } });

  if (!placementId) {
    dispatch({ type: 'LOCATION_SET_GROUPS_FAILURE', payload: { ...defaultError, title: 'Missing placement ID' } });
    return;
  }

  if (locationGroups.length > 0) {
    const state = getState();
    const locationGroup = orderBy(locationGroups, ['id'], ['desc'])[0];

    const geocodingComplete = locationGroup.geocodingStatus === 'COMPLETE';
    const geocodingLocsTotal = locationGroup.locations.length;
    const geocodingLocsCompleted = locationGroup.locations.filter((l) => Boolean(l.geocodeResult)).length;

    // if group geocoding status is COMPLETE, we assume it's correct and skip checking every locations
    const geocodingLocsComplete = geocodingComplete || locationGroup.locations.every((l) => Boolean(l.geocodeResult));

    const geocodingAttempts = get(state, 'location.geocoding.attempts', 0);
    const maxAttempts = 18;
    const delay = 600;
    const increment = 1.2;
    const timeout = geocodingAttempts * delay * increment;

    // if the server doesn't complete the geocoding, we stop after N attempts to avoid an infinite loop
    // stop after 18 attempts (about 3 minutes using the formula above)
    if (geocodingAttempts > maxAttempts) {
      dispatch({
        type: 'LOCATION_GEOCODING_UPDATE',
        payload: {
          status: false,
          result: 'failed',
          attempts: 0,
          completed: geocodingLocsCompleted,
          total: geocodingLocsTotal,
        },
      });
      dispatch({ type: 'LOCATION_SET_GROUPS_FAILURE', payload: defaultError });
      dispatch(enqueueNotification('notification.geocoding.fail', 'warning'));
      return;
    }

    // the B/E flag isn't always correct (geocodingStatus === 'COMPLETE')
    // sometimes it returns NOT_STARTED although all the locations are geocoded
    // so we check and if one or the other seems complete, we're done
    // if both are incomplete then we try again with another fetch
    if (geocodingComplete || geocodingLocsComplete) {
      if (geocodingAttempts > 0) {
        dispatch(enqueueNotification('notification.geocoding.success', 'success'));
      }

      dispatch({
        type: 'LOCATION_GEOCODING_UPDATE',
        payload: {
          status: false,
          result: 'complete',
          attempts: 0,
          completed: geocodingLocsCompleted,
          total: geocodingLocsTotal,
        },
      });
    } else {
      dispatch({
        type: 'LOCATION_GEOCODING_UPDATE',
        payload: {
          status: true,
          result: 'inprogress',
          attempts: geocodingAttempts + 1,
          completed: geocodingLocsCompleted,
          total: geocodingLocsTotal,
        },
      });

      // if geocoding isn't complete, we try to fetch again
      // incremental delay between each requests to gradually reduce the number of attempts
      // 1 = 600ms
      // 2 = 1500ms
      // 3 = 3750ms...
      setTimeout(() => {
        dispatch(getLocationGroupsForPlacement(placementId));
      }, timeout);
    }

    dispatch(setMapLocations(placementId, locationGroup.locations));
  } else {
    dispatch(setMapLocations(placementId, []));
  }
};

export const setMapLocations = (placementId, locations) => (dispatch) => {
  dispatch({
    type: 'LOCATION_SET_MAP_LOCATIONS',
    payload: {
      id: placementId,
      locations,
    },
  });
};

export const retryGeocoding = () => (dispatch) => {
  dispatch({
    type: 'LOCATION_GEOCODING_UPDATE',
    payload: {
      status: true,
      result: null,
      attempts: 1,
      completed: 0,
      total: 0,
    },
  });
};

export const resetLocations = () => (dispatch) => {
  dispatch({ type: 'LOCATION_RESET' });
};
