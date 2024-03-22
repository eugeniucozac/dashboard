import * as utils from 'utils';
import { authLogout, addLoader, removeLoader } from 'stores';

export const getParentPlacements = (parentId) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}} = getState();

  dispatch(getParentPlacementsRequest(parentId));
  dispatch(addLoader('getParentPlacements'));

  return utils.api
    .get({
      token: auth.accessToken,
      endpoint: endpoint.edge,
      path: `api/client/parent/${parentId}/placements`,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleData(json))
    .then((data) => {
      dispatch(getParentPlacementsSuccess(data));
      dispatch(removeLoader('getParentPlacements'));
      return data;
    })
    .catch((err) => {
      const errorParams = {
        file: 'stores/parent.actions.getPlacements',
        message: 'API fetch error (parent.getPlacements)',
      };

      utils.api.handleError(err, errorParams);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(getParentPlacementsFailure(err));
      dispatch(removeLoader('getParentPlacements'));
      return err;
    });
};

export const getParentPlacementsRequest = (parentId) => {
  return {
    type: 'PARENT_PLACEMENTS_GET_REQUEST',
    payload: parentId,
  };
};

export const getParentPlacementsSuccess = (responseData) => {
  return {
    type: 'PARENT_PLACEMENTS_GET_SUCCESS',
    payload: responseData,
  };
};

export const getParentPlacementsFailure = (error) => {
  return {
    type: 'PARENT_PLACEMENTS_GET_FAILURE',
    payload: error,
  };
};
