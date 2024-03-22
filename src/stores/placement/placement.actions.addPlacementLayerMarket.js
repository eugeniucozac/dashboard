import get from 'lodash/get';

// app
import { addLoader, authLogout, enqueueNotification, hideModal, removeLoader } from 'stores';
import * as utils from 'utils';

export const postPlacementAddLayerMarket = (formData) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}} = getState();

  const defaultError = {
    file: 'stores/placement.actions.addLayerMarket',
    message: 'Data missing for POST request',
  };

  dispatch(postPlacementAddLayerMarketRequest(formData));
  dispatch(addLoader('postPlacementAddLayerMarket'));

  if (!formData || !get(formData, 'market.market.id') || !formData.placementlayerId) {
    dispatch(postPlacementAddLayerMarketFailure(defaultError));
    dispatch(enqueueNotification('notification.addMarket.fail', 'error'));
    dispatch(hideModal());
    dispatch(removeLoader('postPlacementAddLayerMarket'));
    return;
  }

  // get the data for POST
  const body = {
    marketId: get(formData, 'market.market.id'),
    placementlayerId: formData.placementlayerId,
  };

  return utils.api
    .post({
      token: auth.accessToken,
      endpoint: endpoint.edge,
      path: 'api/placementlayerMarket',
      data: body,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleData(json))
    .then((data) => {
      dispatch(postPlacementAddLayerMarketSuccess(data));
      dispatch(enqueueNotification('notification.addMarket.success', 'success'));
      dispatch(hideModal());
      dispatch(removeLoader('postPlacementAddLayerMarket'));
      return data;
    })
    .catch((err) => {
      const errorParams = {
        ...defaultError,
        message: 'API post error (placement.addLayerMarket)',
      };

      utils.api.handleError(err, errorParams);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(postPlacementAddLayerMarketFailure(err));
      dispatch(enqueueNotification('notification.addMarket.fail', 'error'));
      dispatch(hideModal());
      dispatch(removeLoader('postPlacementAddLayerMarket'));
      return err;
    });
};

export const postPlacementAddLayerMarketRequest = (data) => {
  return {
    type: 'PLACEMENT_LAYER_MARKET_POST_REQUEST',
    payload: data,
  };
};

export const postPlacementAddLayerMarketSuccess = (data) => {
  return {
    type: 'PLACEMENT_LAYER_MARKET_POST_SUCCESS',
    payload: data,
  };
};

export const postPlacementAddLayerMarketFailure = (error) => {
  return {
    type: 'PLACEMENT_LAYER_MARKET_POST_FAILURE',
    payload: error,
  };
};
