import { addLoader, authLogout, deletePlacementLayerMarkets, enqueueNotification, hideModal, removeLoader } from 'stores';
import * as utils from 'utils';

export const deletePlacementLayerMarket = (layerMarketId) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}} = getState();

  const defaultError = {
    file: 'stores/placement.actions.deleteLayerMarket',
    message: 'Data missing for DELETE request',
  };

  dispatch(deletePlacementLayerMarketRequest(layerMarketId));
  dispatch(addLoader('deletePlacementLayerMarket'));

  if (!layerMarketId) {
    dispatch(deletePlacementLayerMarketFailure(defaultError));
    dispatch(enqueueNotification('notification.deleteLayerMarket.fail', 'error'));
    dispatch(hideModal());
    dispatch(removeLoader('deletePlacementLayerMarket'));
    return;
  }

  return utils.api
    .delete({
      token: auth.accessToken,
      endpoint: endpoint.edge,
      path: `api/placementlayerMarket/${layerMarketId}`,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleData(json, true))
    .then((data) => {
      dispatch(deletePlacementLayerMarketSuccess(data));
      dispatch(deletePlacementLayerMarkets([layerMarketId]));
      dispatch(enqueueNotification('notification.deleteLayerMarket.success', 'success'));
      dispatch(hideModal());
      dispatch(removeLoader('deletePlacementLayerMarket'));
    })
    .catch((err) => {
      const errorParams = {
        ...defaultError,
        message: 'API delete error (placement.deleteLayerMarket)',
      };

      utils.api.handleError(err, errorParams);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(deletePlacementLayerMarketFailure(err));
      dispatch(enqueueNotification('notification.deleteLayerMarket.fail', 'error'));
      dispatch(hideModal());
      dispatch(removeLoader('deletePlacementLayerMarket'));
      return err;
    });
};

export const deletePlacementLayerMarketRequest = (data) => {
  return {
    type: 'PLACEMENT_LAYER_MARKET_DELETE_REQUEST',
    payload: data,
  };
};

export const deletePlacementLayerMarketSuccess = (data) => {
  return {
    type: 'PLACEMENT_LAYER_MARKET_DELETE_SUCCESS',
    payload: data,
  };
};

export const deletePlacementLayerMarketFailure = (error) => {
  return {
    type: 'PLACEMENT_LAYER_MARKET_DELETE_FAILURE',
    payload: error,
  };
};
