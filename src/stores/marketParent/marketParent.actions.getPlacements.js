import * as utils from 'utils';
import { authLogout, addLoader, removeLoader } from 'stores';

export const getMarketParentPlacements = (marketParentId) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}} = getState();

  const defaultError = {
    file: 'stores/marketParent.actions.getPlacements',
  };

  if (!marketParentId) {
    dispatch(getMarketParentPlacementsFailure(defaultError));
    return;
  }

  dispatch(getMarketParentPlacementsRequest(marketParentId));
  dispatch(addLoader('getMarketParentPlacements'));

  return utils.api
    .get({
      token: auth.accessToken,
      endpoint: endpoint.edge,
      path: `api/marketParent/${marketParentId}/placements`,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleData(json))
    .then((data) => {
      dispatch(getMarketParentPlacementsSuccess(data, marketParentId));
      dispatch(removeLoader('getMarketParentPlacements'));
      return data;
    })
    .catch((err) => {
      const errorParams = {
        file: 'stores/marketParent.actions.getPlacements',
        message: 'API fetch error (marketParent.getPlacements)',
      };

      utils.api.handleError(err, errorParams);
      utils.api.handleUnauthorized(err, dispatch, authLogout);

      // TODO: Replace with failure once BE implemented
      // dispatch(getMarketParentPlacementsFailure(err));
      dispatch(getMarketParentPlacementsSuccess([], marketParentId));

      dispatch(removeLoader('getMarketParentPlacements'));
      return err;
    });
};

export const getMarketParentPlacementsRequest = (marketParentId) => {
  return {
    type: 'MARKET_PARENT_PLACEMENTS_GET_REQUEST',
    payload: marketParentId,
  };
};

export const getMarketParentPlacementsSuccess = (responseData, marketParentId) => {
  return {
    type: 'MARKET_PARENT_PLACEMENTS_GET_SUCCESS',
    payload: {
      placements: responseData,
      marketParentId,
    },
  };
};

export const getMarketParentPlacementsFailure = (error) => {
  return {
    type: 'MARKET_PARENT_PLACEMENTS_GET_FAILURE',
    payload: error,
  };
};
