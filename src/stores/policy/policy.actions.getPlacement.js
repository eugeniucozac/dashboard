import * as utils from 'utils';
import { authLogout } from 'stores';

export const getPolicyPlacement = (placementId) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}} = getState();

  const defaultError = {
    file: 'stores/policy.actions.getPlacement',
  };

  dispatch(getPolicyPlacementRequest(placementId));

  if (!placementId) {
    dispatch(getPolicyPlacementFailure({ ...defaultError, message: 'Missing placement ID' }));
    return;
  }

  return utils.api
    .get({
      token: auth.accessToken,
      endpoint: endpoint.edge,
      path: `api/placement/${placementId}`,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleData(json))
    .then((data) => {
      dispatch(getPolicyPlacementSuccess(data));
      return data;
    })
    .catch((err) => {
      utils.api.handleError(err, { ...defaultError, message: 'API fetch error (policy.getPlacement)' });
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(getPolicyPlacementFailure(err));
      return err;
    });
};

export const getPolicyPlacementRequest = (placementId) => {
  return {
    type: 'POLICY_PLACEMENT_GET_REQUEST',
    payload: placementId,
  };
};

export const getPolicyPlacementSuccess = (responseData) => {
  return {
    type: 'POLICY_PLACEMENT_GET_SUCCESS',
    payload: responseData,
  };
};

export const getPolicyPlacementFailure = (error) => {
  return {
    type: 'POLICY_PLACEMENT_GET_FAILURE',
    payload: error,
  };
};
