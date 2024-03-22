import get from 'lodash/get';

import { addLoader, authLogout, enqueueNotification, hideModal, removeLoader } from 'stores';
import * as utils from 'utils';

export const bulkToggleSelectMarketingMarket = () => {
  return {
    type: 'BULK_SELECT_TOGGLE_MARKETING_MARKETS',
  };
};
export const bulkPlacementMarketingMarketSelect = (selected, marketIdList) => {
  return {
    type: 'PLACEMENT_BULK_TOGGLE_MARKETING_MARKETS',
    payload: { selected, marketIdList },
  };
};
export const bulkMarketingMarketsClearAll = () => {
  return {
    type: 'PLACEMENT_BULK_CLEAR_ALL_MARKETING_MARKETS',
  };
};
export const disableBulkToggleSelectMarketingMarket = () => {
  return {
    type: 'BULK_SELECT_TOGGLE_DISABLE_MARKETING_MARKETS',
  };
};

export const bulkeletePlacementMarket = (formData) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint } } } = getState();
  const action = 'delete';
  const bulkItems = get(getState(), 'placement.bulkItemsMarketingMarkets.marketingMarkets', []);
  const marketIdList = bulkItems.map((marketId) => marketId);

  const defaultError = {
    file: 'stores/placement.actions.deletePlacementMarket',
    message: 'Data missing for DELETE request',
  };

  dispatch(bulkDeletePlacementMarketRequest(formData));
  dispatch(addLoader('deletePlacementMarket'));

  return utils.api
    .post({
      token: auth.accessToken,
      endpoint: endpoint.edge,
      path: `api/placementMarket/bulk/${action}`,
      data: marketIdList,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleData(json, true))
    .then(() => {
      dispatch(bulkDeletePlacementMarketSuccess(marketIdList));
      dispatch(enqueueNotification('notification.deletePlacementMarket.success', 'success'));
      dispatch(bulkMarketingMarketsClearAll());
      dispatch(hideModal());
      dispatch(removeLoader('deletePlacementMarket'));
    })
    .catch((err) => {
      const errorParams = {
        ...defaultError,
        message: 'API delete error (placement.deletePlacementMarket)',
      };

      utils.api.handleError(err, errorParams);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(bulkDeletePlacementMarketFailure(err));
      dispatch(enqueueNotification('notification.deletePlacementMarket.fail', 'error'));
      dispatch(hideModal());
      dispatch(removeLoader('deletePlacementMarket'));
      return err;
    });
};

export const bulkDeletePlacementMarketRequest = (data) => {
  return {
    type: 'PLACEMENT_MARKET_BULK_DELETE_REQUEST',
    payload: data,
  };
};

export const bulkDeletePlacementMarketSuccess = (data) => {
  return {
    type: 'PLACEMENT_MARKET_BULK_DELETE_SUCCESS',
    payload: data,
  };
};

export const bulkDeletePlacementMarketFailure = (error) => {
  return {
    type: 'PLACEMENT_MARKET_BULK_DELETE_FAILURE',
    payload: error,
  };
};
