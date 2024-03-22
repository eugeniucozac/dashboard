import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';

// app
import {
  addLoader,
  authLogout,
  deletePlacementLayers,
  deletePlacementLayerMarkets,
  enqueueNotification,
  hideModal,
  removeLoader,
  updateSelectedLayerMarket,
  updatePlacementLayerMarkets,
  bulkPlacementClearAll,
  updatePlacementLayers,
} from 'stores';
import * as utils from 'utils';

export const postPlacementBulkLayer = (formData, bulkType) => (dispatch, getState) => {
  const bulkItems =
    bulkType === 'layer' ? get(getState(), 'placement.bulkItems.layers', []) : get(getState(), 'placement.bulkItems.layerMarkets', []);

  const defaultError = {
    file: 'stores/placement.actions.bulkLayer',
    message: 'Data missing for POST request',
  };

  if (!formData || !bulkType || isEmpty(bulkItems)) {
    dispatch(postPlacementBulkLayerUpdateFailure(defaultError));
    dispatch(enqueueNotification('notification.bulkEdit.fail', 'error'));
    dispatch(hideModal());
    return;
  }

  if (bulkType === 'layer') {
    return dispatch(postPlacementBulkLayerUpdate(formData));
  } else {
    return dispatch(postPlacementBulkLayerUpdateMarket(formData));
  }
};

export const postPlacementBulkLayerUpdate = (formData) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint } } } = getState();

  const action = formData.delete ? 'delete' : 'edit';
  const bulkItems = get(getState(), 'placement.bulkItems.layers', []);

  const body = bulkItems.map((layerId) => {
    const currentLayer = utils.layers.getById(get(getState(), 'placement.selected.layers', []), layerId);

    if (action === 'delete') {
      return layerId;
    }
    return {
      ...currentLayer,
      ...(formData.isoCode && { isoCode: formData.isoCode }),
      ...(formData.isoCode && { isoCurrencyCode: formData.isoCode }),
    };
  });

  dispatch(postPlacementBulkLayerUpdateRequest(formData));
  dispatch(addLoader('postPlacementBulkLayerUpdate'));

  return utils.api
    .post({
      token: auth.accessToken,
      endpoint: endpoint.edge,
      path: `api/placementlayer/bulk/${action}`,
      data: body,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleData(json))
    .then((data) => {
      dispatch(postPlacementBulkLayerUpdateSuccess(data));

      // on POST success update the UI
      if (formData.delete) {
        dispatch(deletePlacementLayers(body));
      } else {
        dispatch(updatePlacementLayers(body));
      }

      action === 'delete'
        ? dispatch(enqueueNotification('notification.bulkDelete.success', 'success'))
        : dispatch(enqueueNotification('notification.bulkEdit.success', 'success'));
      dispatch(bulkPlacementClearAll());
      dispatch(hideModal());
      dispatch(removeLoader('postPlacementBulkLayerUpdate'));
    })
    .catch((err) => {
      const errorParams = {
        file: 'stores/placement.actions.bulk',
        message: 'API post error (placement.bulk)',
      };
      utils.api.handleError(err, errorParams);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(postPlacementBulkLayerUpdateFailure(err));
      action === 'delete'
        ? dispatch(enqueueNotification('notification.bulkDelete.fail', 'success'))
        : dispatch(enqueueNotification('notification.bulkEdit.fail', 'error'));
      dispatch(hideModal());
      dispatch(removeLoader('postPlacementBulkLayerUpdate'));
      return err;
    });
};

export const postPlacementBulkLayerUpdateMarket = (formData) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint } } } = getState();

  const action = formData.delete ? 'delete' : 'edit';
  const bulkItems = get(getState(), 'placement.bulkItems.layerMarkets', []);

  const body = bulkItems.map((marketId) => {
    const currentMarket = utils.layers.getMarketById(get(getState(), 'placement.selected.layers', []), marketId);

    if (action === 'delete') {
      return marketId;
    }

    return {
      ...currentMarket,
      ...(formData.statusId && { statusId: parseFloat(formData.statusId) }),
      ...((formData.premium || formData.premium === 0) && { premium: parseFloat(formData.premium) }),
      ...(formData.isoCode && { isoCode: formData.isoCode }),
      ...(formData.uniqueMarketReference && { uniqueMarketReference: formData.uniqueMarketReference.id }),
      ...(formData.section && { section: formData.section.toUpperCase() }),
      ...(formData.written && { writtenLinePercentage: formData.written }),
      ...(formData.quoteDate && { quoteDate: formData.quoteDate }),
      ...(formData.validUntilDate && { validUntilDate: formData.validUntilDate }),
      ...(formData.subjectivities && { subjectivities: formData.subjectivities }),
    };
  });

  dispatch(postPlacementBulkLayerUpdateRequest(formData));
  dispatch(addLoader('postPlacementBulkMarket'));

  return utils.api
    .post({
      token: auth.accessToken,
      endpoint: endpoint.edge,
      path: `api/placementlayerMarket/bulk/${action}`,
      data: body,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleData(json))
    .then((data) => {
      dispatch(postPlacementBulkLayerUpdateSuccess(data));

      // on POST success -> update the store
      // in this case, we don't expect the updated data to be returned from the API
      // so we take the data sent (body) and do an "optimistic update" on the UI
      if (formData.delete) {
        dispatch(deletePlacementLayerMarkets(body));
      } else {
        dispatch(updatePlacementLayerMarkets(body));
      }

      dispatch(updateSelectedLayerMarket());
      action === 'delete'
        ? dispatch(enqueueNotification('notification.bulkDelete.success', 'success'))
        : dispatch(enqueueNotification('notification.bulkEdit.success', 'success'));
      dispatch(bulkPlacementClearAll());
      dispatch(hideModal());
      dispatch(removeLoader('postPlacementBulkMarket'));
    })
    .catch((err) => {
      const errorParams = {
        file: 'stores/placement.actions.bulk',
        message: 'API post error (placement.bulk)',
      };

      utils.api.handleError(err, errorParams);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(postPlacementBulkLayerUpdateFailure(err));
      action === 'delete'
        ? dispatch(enqueueNotification('notification.bulkDelete.fail', 'success'))
        : dispatch(enqueueNotification('notification.bulkEdit.fail', 'error'));
      dispatch(hideModal());
      dispatch(removeLoader('postPlacementBulkMarket'));
      return err;
    });
};

export const postPlacementBulkLayerUpdateRequest = (data) => {
  return {
    type: 'PLACEMENT_BULK_LAYER_POST_REQUEST',
    payload: data,
  };
};

export const postPlacementBulkLayerUpdateSuccess = (data) => {
  return {
    type: 'PLACEMENT_BULK_LAYER_POST_SUCCESS',
    payload: data,
  };
};

export const postPlacementBulkLayerUpdateFailure = (error) => {
  return {
    type: 'PLACEMENT_BULK_LAYER_POST_FAILURE',
    payload: error,
  };
};
