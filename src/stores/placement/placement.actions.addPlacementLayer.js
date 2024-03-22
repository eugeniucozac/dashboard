import get from 'lodash/get';

// app
import { addLoader, authLogout, enqueueNotification, hideModal, removeLoader } from 'stores';
import * as utils from 'utils';

export const postPlacementAddLayer = (formData) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}} = getState();

  const defaultError = {
    file: 'stores/placement.actions.addLayer',
    message: 'Data missing for POST request',
  };

  dispatch(postPlacementAddLayerRequest(formData));
  dispatch(addLoader('postPlacementAddLayer'));

  if (!formData || !formData.businessType) {
    dispatch(postPlacementAddLayerFailure(defaultError));
    dispatch(enqueueNotification('notification.addLayer.fail', 'error'));
    dispatch(hideModal('ADD_PLACEMENT_LAYER'));
    dispatch(removeLoader('postPlacementAddLayer'));
    return;
  }

  // get the data for POST
  const body = {
    placementId: get(getState(), 'placement.selected.id'),
    departmentId: get(getState(), 'placement.selected.departmentId'),
    businessTypeId: get(formData, 'businessType[0].id'),
    isoCurrencyCode: get(formData, 'currency'),
    notes: formData.notes,
    amount: !formData.buydown ? parseFloat(formData.amount) : '',
    excess: !formData.buydown ? parseFloat(formData.excess) : '',
  };

  return utils.api
    .post({
      token: auth.accessToken,
      endpoint: endpoint.edge,
      path: 'api/placementlayer',
      data: body,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleData(json))
    .then((data) => {
      dispatch(postPlacementAddLayerSuccess(data));
      dispatch(enqueueNotification('notification.addLayer.success', 'success'));
      dispatch(hideModal('ADD_PLACEMENT_LAYER'));
      dispatch(removeLoader('postPlacementAddLayer'));
    })
    .catch((err) => {
      const errorParams = {
        ...defaultError,
        message: 'API post error (placement.addLayer)',
      };

      utils.api.handleError(err, errorParams);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(postPlacementAddLayerFailure(err));
      dispatch(enqueueNotification('notification.addLayer.fail', 'error'));
      dispatch(hideModal('ADD_PLACEMENT_LAYER'));
      dispatch(removeLoader('postPlacementAddLayer'));
      return err;
    });
};

export const postPlacementAddLayerRequest = (data) => {
  return {
    type: 'PLACEMENT_LAYER_POST_REQUEST',
    payload: data,
  };
};

export const postPlacementAddLayerSuccess = (data) => {
  return {
    type: 'PLACEMENT_LAYER_POST_SUCCESS',
    payload: data,
  };
};

export const postPlacementAddLayerFailure = (error) => {
  return {
    type: 'PLACEMENT_LAYER_POST_FAILURE',
    payload: error,
  };
};
