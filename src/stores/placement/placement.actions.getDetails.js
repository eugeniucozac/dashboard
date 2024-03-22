import { addLoader, authLogout, getLocationGroupsForPlacement, removeLoader, resetPlacementLocations } from 'stores';
import * as utils from 'utils';

export const getPlacementDetails =
  (id, showLoader, getLocations = false) =>
  (dispatch, getState) => {
    // prettier-ignore
    const { user: { auth }, config: { vars: { endpoint }}} = getState();

    const defaultError = {
      file: 'stores/placement.actions.getDetails',
    };

    dispatch(getPlacementDetailsRequest(id));
    dispatch(resetPlacementLocations());

    if (showLoader) {
      dispatch(addLoader('getPlacementDetails'));
    }

    if (!id) {
      dispatch(getPlacementDetailsFailure({ ...defaultError, message: 'ID missing' }));
      dispatch(removeLoader('getPlacementDetails'));
      return { ...defaultError, message: 'ID missing' };
    }

    return utils.api
      .get({
        token: auth.accessToken,
        endpoint: endpoint.edge,
        path: `api/placement/${id}`,
      })
      .then((response) => utils.api.handleResponse(response))
      .then((json) => utils.api.handleData(json))
      .then((data) => {
        if (showLoader) {
          dispatch(removeLoader('getPlacementDetails'));
        }

        dispatch(getPlacementDetailsSuccess(data));
        getLocations && dispatch(getLocationGroupsForPlacement(id, showLoader));
        return data;
      })
      .catch((err) => {
        if (showLoader) {
          dispatch(removeLoader('getPlacementDetails'));
        }

        utils.api.handleError(err, defaultError);
        utils.api.handleUnauthorized(err, dispatch, authLogout);
        dispatch(getPlacementDetailsFailure(err));
        return { ...defaultError, ...err, message: 'API get error (placement.getDetails)' };
      });
  };

export const getPlacementDetailsRequest = (id) => {
  return {
    type: 'PLACEMENT_DETAILS_GET_REQUEST',
    payload: id,
  };
};

export const getPlacementDetailsSuccess = (placementObject) => {
  return {
    type: 'PLACEMENT_DETAILS_GET_SUCCESS',
    payload: placementObject,
  };
};

export const getPlacementDetailsFailure = (error) => {
  return {
    type: 'PLACEMENT_DETAILS_GET_FAILURE',
    payload: error,
  };
};
