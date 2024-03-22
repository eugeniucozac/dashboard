import get from 'lodash/get';

// app
import * as utils from 'utils';
import { authLogout, addLoader, enqueueNotification, hideModal, removeLoader } from 'stores';

export const postAddPlacementMarket = (formData) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}} = getState();

  const defaultError = {
    file: 'stores/placement.actions.addPlacementMarket',
    message: 'Data missing for POST request',
  };

  dispatch(postAddPlacementMarketRequest(formData));
  dispatch(addLoader('postAddPlacementMarket'));

  if (!formData || !formData.placementId || !get(formData, 'markets.id')) {
    dispatch(postAddPlacementMarketFailure(defaultError));
    dispatch(enqueueNotification('notification.addPlacementMarket.fail', 'error'));
    dispatch(hideModal());
    dispatch(removeLoader('postAddPlacementMarket'));
    return;
  }

  return utils.api
    .post({
      token: auth.accessToken,
      endpoint: endpoint.edge,
      path: 'api/placementMarket',
      data: {
        marketId: get(formData, 'markets.id'),
        placementId: formData.placementId,
        notes: formData.notes || null,
        statusId: formData.statusId || null,
      },
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleData(json))
    .then((data) => {
      dispatch(postAddPlacementMarketSuccess(data));
      dispatch(enqueueNotification('notification.addPlacementMarket.success', 'success'));
      dispatch(hideModal());
      dispatch(removeLoader('postAddPlacementMarket'));
      return data;
    })
    .catch((err) => {
      const errorParams = {
        ...defaultError,
        message: 'API post error (placement.postAddPlacementMarket)',
      };

      utils.api.handleError(err, errorParams);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(postAddPlacementMarketFailure(err));
      dispatch(enqueueNotification('notification.addPlacementMarket.fail', 'error'));
      dispatch(hideModal());
      dispatch(removeLoader('postAddPlacementMarket'));
      return err;
    });
};

export const postAddPlacementMarketRequest = (data) => {
  return {
    type: 'PLACEMENT_MARKET_ADD_POST_REQUEST',
    payload: data,
  };
};

export const postAddPlacementMarketSuccess = (data) => {
  return {
    type: 'PLACEMENT_MARKET_ADD_POST_SUCCESS',
    payload: data,
  };
};

export const postAddPlacementMarketFailure = (error) => {
  return {
    type: 'PLACEMENT_MARKET_ADD_POST_FAILURE',
    payload: error,
  };
};
