import get from 'lodash/get';

// app
import * as utils from 'utils';
import { authLogout, addLoader, enqueueNotification, hideModal, removeLoader } from 'stores';

export const changePlacementMarket = (placementMarketId, formData) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint } } } = getState();

  const defaultError = {
    file: 'stores/placement.actions.changePlacementMarket',
    message: 'Data missing for POST request',
  };
  dispatch(changePlacementMarketRequest(formData));
  dispatch(addLoader('changePlacementMarket'));

  if (!formData || !formData.placementId || !get(formData, 'markets.id') || !placementMarketId) {
    dispatch(changePlacementMarketFailure(defaultError));
    dispatch(enqueueNotification('notification.changePlacementMarket.fail', 'error'));
    dispatch(hideModal());
    dispatch(removeLoader('changePlacementMarket'));
    return;
  }

  const id = placementMarketId;
  return utils.api
    .put({
      token: auth.accessToken,
      endpoint: endpoint.edge,
      path: `api/placementMarket/${id}/change-market`,
      data: {
        marketId: get(formData, 'markets.id'),
      },
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleData(json))
    .then((data) => {
      dispatch(changePlacementMarketSuccess(data));
      dispatch(enqueueNotification('notification.changePlacementMarket.success', 'success'));
      dispatch(hideModal());
      dispatch(removeLoader('changePlacementMarket'));
      return data;
    })
    .catch((err) => {
      const errorParams = {
        ...defaultError,
        message: 'API post error (placement.changePlacementMarket)',
      };
      utils.api.handleError(err, errorParams);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(changePlacementMarketFailure(err));
      if (err.status === 'error') {
        dispatch(enqueueNotification('notification.changePlacementMarket.alreadyExist', 'warning'));
      } else {
        dispatch(enqueueNotification('notification.changePlacementMarket.fail', 'error'));
      }
      dispatch(hideModal());
      dispatch(removeLoader('changePlacementMarket'));
      return err;
    });
};

export const changePlacementMarketRequest = (data) => {
  return {
    type: 'PLACEMENT_MARKET_CHANGE_PUT_REQUEST',
    payload: data,
  };
};

export const changePlacementMarketSuccess = (data) => {
  return {
    type: 'PLACEMENT_MARKET_CHANGE_PUT_SUCCESS',
    payload: data,
  };
};

export const changePlacementMarketFailure = (error) => {
  return {
    type: 'PLACEMENT_MARKET_CHANGE_PUT_FAILURE',
    payload: error,
  };
};
