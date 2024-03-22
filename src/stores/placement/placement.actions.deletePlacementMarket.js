import { addLoader, authLogout, enqueueNotification, hideModal, removeLoader } from 'stores';
import * as utils from 'utils';

export const deletePlacementMarket = (placementMarketId) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}} = getState();

  const defaultError = {
    file: 'stores/placement.actions.deletePlacementMarket',
    message: 'Data missing for DELETE request',
  };

  dispatch(deletePlacementMarketRequest(placementMarketId));
  dispatch(addLoader('deletePlacementMarket'));

  if (!placementMarketId) {
    dispatch(deletePlacementMarketFailure(defaultError));
    dispatch(enqueueNotification('notification.deletePlacementMarket.fail', 'error'));
    dispatch(hideModal());
    dispatch(removeLoader('deletePlacementMarket'));
    return;
  }

  return utils.api
    .delete({
      token: auth.accessToken,
      endpoint: endpoint.edge,
      path: `api/placementMarket/${placementMarketId}`,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleData(json, true))
    .then(() => {
      dispatch(deletePlacementMarketSuccess(placementMarketId));
      dispatch(enqueueNotification('notification.deletePlacementMarket.success', 'success'));
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
      dispatch(deletePlacementMarketFailure(err));
      dispatch(enqueueNotification('notification.deletePlacementMarket.fail', 'error'));
      dispatch(hideModal());
      dispatch(removeLoader('deletePlacementMarket'));
      return err;
    });
};

export const deletePlacementMarketRequest = (placementMarketId) => {
  return {
    type: 'PLACEMENT_MARKET_DELETE_REQUEST',
    payload: placementMarketId,
  };
};

export const deletePlacementMarketSuccess = (placementMarketId) => {
  return {
    type: 'PLACEMENT_MARKET_DELETE_SUCCESS',
    payload: placementMarketId,
  };
};

export const deletePlacementMarketFailure = (error) => {
  return {
    type: 'PLACEMENT_MARKET_DELETE_FAILURE',
    payload: error,
  };
};
