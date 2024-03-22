import get from 'lodash/get';
import toNumber from 'lodash/toNumber';

// app
import { addLoader, authLogout, enqueueNotification, hideModal, removeLoader } from 'stores';
import * as utils from 'utils';

export const patchPlacementEditLayer = (formData) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}} = getState();

  const defaultError = {
    file: 'stores/placement.actions.editLayer',
    message: 'Data missing for PATCH request',
  };

  const layers = get(getState(), 'placement.selected.layers', []);
  const layer = utils.policies.getById(layers, formData.layerId);

  const getAmount = (key, value) => {
    const prevValue = layer[key];
    const isNewValue = Boolean(formData[key] || (prevValue && !formData[key]));

    return isNewValue ? formData[key] || 'empty' : null;
  };

  const amount = getAmount('amount', formData.amount);
  const excess = getAmount('excess', formData.excess);

  dispatch(patchPlacementEditLayerRequest(formData));
  dispatch(addLoader('patchPlacementEditLayer'));

  if (!formData || !formData.layerId || !formData.departmentId || !formData.businessTypeId) {
    dispatch(patchPlacementEditLayerFailure(defaultError));
    dispatch(enqueueNotification('notification.editLayer.fail', 'error'));
    dispatch(hideModal());
    dispatch(removeLoader('patchPlacementEditLayer'));
    return;
  }

  // get the data for PATCH
  const body = {
    ...(get(formData, 'currency') && { isoCurrencyCode: formData.currency }),
    ...(get(formData, 'status') && { statusId: formData.status === 'null' || formData.status === '' ? null : toNumber(formData.status) }),
    ...(get(formData, 'notes') && { notes: formData.notes }),
    ...(amount && { amount: formData.buydown ? '' : amount === 'empty' ? 0 : toNumber(amount) }),
    ...(excess && { excess: formData.buydown ? '' : excess === 'empty' ? 0 : toNumber(excess) }),
  };

  return utils.api
    .patch({
      token: auth.accessToken,
      endpoint: endpoint.edge,
      path: `api/placementlayer/${formData.layerId}`,
      data: body,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleData(json))
    .then((data) => {
      dispatch(patchPlacementEditLayerSuccess(data));
      dispatch(enqueueNotification('notification.editLayer.success', 'success'));
      dispatch(hideModal());
      dispatch(removeLoader('patchPlacementEditLayer'));
    })
    .catch((err) => {
      const errorParams = {
        ...defaultError,
        message: 'API patch error (placement.editLayer)',
      };

      utils.api.handleError(err, errorParams);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(patchPlacementEditLayerFailure(err));
      dispatch(enqueueNotification('notification.editLayer.fail', 'error'));
      dispatch(hideModal());
      dispatch(removeLoader('patchPlacementEditLayer'));
      return err;
    });
};

export const patchPlacementEditLayerRequest = (data) => {
  return {
    type: 'PLACEMENT_LAYER_PATCH_REQUEST',
    payload: data,
  };
};

export const patchPlacementEditLayerSuccess = (data) => {
  return {
    type: 'PLACEMENT_LAYER_PATCH_SUCCESS',
    payload: data,
  };
};

export const patchPlacementEditLayerFailure = (error) => {
  return {
    type: 'PLACEMENT_LAYER_PATCH_FAILURE',
    payload: error,
  };
};
