import { addLoader, authLogout, deletePlacementLayers, enqueueNotification, hideModal, removeLoader } from 'stores';
import * as utils from 'utils';

export const deletePlacementLayer = (layerId) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}} = getState();

  const defaultError = {
    file: 'stores/placement.actions.deleteLayer',
    message: 'Data missing for DELETE request',
  };

  dispatch(deletePlacementLayerRequest(layerId));
  dispatch(addLoader('deletePlacementLayer'));

  if (!layerId) {
    dispatch(deletePlacementLayerFailure(defaultError));
    dispatch(enqueueNotification('notification.deleteLayer.fail', 'error'));
    dispatch(hideModal());
    dispatch(removeLoader('deletePlacementLayer'));
    return;
  }

  return utils.api
    .delete({
      token: auth.accessToken,
      endpoint: endpoint.edge,
      path: `api/placementlayer/${layerId}`,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleData(json))
    .then((data) => {
      dispatch(deletePlacementLayerSuccess(data));
      dispatch(deletePlacementLayers([layerId]));
      dispatch(enqueueNotification('notification.deleteLayer.success', 'success'));
      dispatch(hideModal());
      dispatch(removeLoader('deletePlacementLayer'));
    })
    .catch((err) => {
      const errorParams = {
        ...defaultError,
        message: 'API delete error (placement.deleteLayer)',
      };

      utils.api.handleError(err, errorParams);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(deletePlacementLayerFailure(err));
      dispatch(enqueueNotification('notification.deleteLayer.fail', 'error'));
      dispatch(hideModal());
      dispatch(removeLoader('deletePlacementLayer'));
      return err;
    });
};

export const deletePlacementLayerRequest = (data) => {
  return {
    type: 'PLACEMENT_LAYER_DELETE_REQUEST',
    payload: data,
  };
};

export const deletePlacementLayerSuccess = (data) => {
  return {
    type: 'PLACEMENT_LAYER_DELETE_SUCCESS',
    payload: data,
  };
};

export const deletePlacementLayerFailure = (error) => {
  return {
    type: 'PLACEMENT_LAYER_DELETE_FAILURE',
    payload: error,
  };
};
