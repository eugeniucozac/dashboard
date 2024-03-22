import { addLoader, authLogout, removeLoader } from 'stores';
import * as utils from 'utils';

export const getPlacementMarkets = (placementId) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}} = getState();

  const defaultError = {
    file: 'stores/placement.actions.getMarkets',
  };

  dispatch(getPlacementMarketsRequest(placementId));
  dispatch(addLoader('getPlacementMarkets'));

  if (!placementId) {
    dispatch(getPlacementMarketsFailure({ ...defaultError, message: 'Missing placement ID' }));
    dispatch(removeLoader('getPlacementMarkets'));
    return;
  }

  return utils.api
    .get({
      token: auth.accessToken,
      endpoint: endpoint.edge,
      path: `api/placementMarket/placement/${placementId}`,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleData(json))
    .then((data) => {
      dispatch(getPlacementMarketsSuccess(placementId, data));
      return data;
    })
    .catch((err) => {
      utils.api.handleError(err, defaultError);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(getPlacementMarketsFailure(err));
      return err;
    })
    .finally(() => {
      dispatch(removeLoader('getPlacementMarkets'));
    });
};

export const getPlacementMarketsRequest = (placementId) => {
  return {
    type: 'PLACEMENT_MARKETS_LIST_GET_REQUEST',
    payload: placementId,
  };
};

export const getPlacementMarketsSuccess = (placementId, data) => {
  return {
    type: 'PLACEMENT_MARKETS_LIST_GET_SUCCESS',
    payload: {
      placementId,
      placementMarkets: data,
    },
  };
};

export const getPlacementMarketsFailure = (error) => {
  return {
    type: 'PLACEMENT_MARKETS_LIST_GET_FAILURE',
    payload: error,
  };
};
