import compact from 'lodash/compact';
import get from 'lodash/get';

// app
import * as utils from 'utils';
import { authLogout, addLoader, enqueueNotification, hideModal, removeLoader, updateSelectedLayerMarket } from 'stores';

export const editPlacementMarketsLayers =
  (formData, dirtyFields, closeModal = true) =>
  (dispatch, getState) => {
    // prettier-ignore
    const { user: { auth }, config: { vars: { endpoint }}} = getState();

    const defaultError = {
      file: 'stores/placement.actions.editPlacementMarketsLayers',
      message: 'Data missing for PUT request',
    };

    dispatch(editPlacementMarketRequest(formData));
    dispatch(addLoader('editPlacementMarketsLayers'));

    // || !formData.market?.id
    if (!formData) {
      dispatch(editPlacementMarketFailure(defaultError));
      dispatch(enqueueNotification('notification.editPlacementMarketsLayers.fail', 'error'));
      if (closeModal) {
        dispatch(hideModal());
      }
      dispatch(removeLoader('editPlacementMarketsLayers'));
      return;
    }

    const marketId = get(formData, 'market.id');
    const layerMarketId = get(formData, 'layerMarket.id');

    const isMarketEdited = ['market_notes', 'market_statusId', 'market_rationales', 'market_declinatures', 'market_underwriter'].some(
      (field) => Object.keys(dirtyFields).includes(field)
    );

    const isLayerMarketEdited = [
      'layerMarket_statusId',
      'layerMarket_isLeader',
      'layerMarket_lineToStand',
      'layerMarket_declinatures',
      'layerMarket_uniqueMarketReference',
      'layerMarket_section',
      'layerMarket_subjectivities',
      'layerMarket_currency',
      'layerMarket_premium',
      'layerMarket_writtenLinePercentage',
      'layerMarket_quoteDate',
      'layerMarket_validUntilDate',
    ].some((field) => Object.keys(dirtyFields).includes(field));

    return Promise.all(
      compact([
        isMarketEdited && marketId
          ? utils.api.put({
              token: auth.accessToken,
              endpoint: endpoint.edge,
              path: `api/placementMarket/${marketId}`,
              data: {
                notes: formData.market_notes || '',
                statusId: formData.market_statusId || null,
                rationaleIds: formData.market_rationales?.length > 0 ? formData.market_rationales.map((r) => r.id) : [],
                declinatureIds: formData.market_declinatures?.length > 0 ? formData.market_declinatures.map((d) => d.id) : [],
                underwriterId: get(formData, 'market_underwriter.id', null),
              },
            })
          : null,
        isLayerMarketEdited && layerMarketId
          ? utils.api.patch({
              token: auth.accessToken,
              endpoint: endpoint.edge,
              path: `api/placementlayerMarket/${layerMarketId}`,
              data: {
                statusId: formData.layerMarket_statusId,
                isLeader: formData.layerMarket_isLeader,
                lineToStand: formData.layerMarket_lineToStand,
                declinatureIds: formData.layerMarket_declinatures?.length > 0 ? formData.layerMarket_declinatures.map((d) => d.id) : [],
                uniqueMarketReference: get(formData, 'layerMarket_uniqueMarketReference.id', ''),
                section: formData.layerMarket_section?.toUpperCase(),
                subjectivities: formData.layerMarket_subjectivities,
                isoCode: formData.layerMarket_currency,
                premium: formData.layerMarket_premium,
                writtenLinePercentage: formData.layerMarket_writtenLinePercentage,
                quoteDate: formData.layerMarket_quoteDate,
                validUntilDate: formData.layerMarket_validUntilDate,
              },
            })
          : null,
      ])
    )
      .then((response) => Promise.all(response.map((r) => utils.api.handleResponse(r))))
      .then((json) => Promise.all(json.map((j) => utils.api.handleData(j))))
      .then((data) => {
        const marketData = isMarketEdited ? data[0] : null;
        const layerMarketData = isLayerMarketEdited ? (isMarketEdited ? data[1] : data[0]) : null;

        // success placementMarket update
        if (isMarketEdited && marketData) {
          dispatch(editPlacementMarketSuccess(marketData));
        }

        // success placementLayerMarket update
        if (isLayerMarketEdited) {
          dispatch(editPlacementLayerMarketSuccess(layerMarketData));
          dispatch(updateSelectedLayerMarket());
        }

        dispatch(enqueueNotification('notification.editPlacementMarketsLayers.success', 'success'));

        if (closeModal) {
          dispatch(hideModal());
        }

        dispatch(removeLoader('editPlacementMarketsLayers'));

        return {
          ...(marketData && { market: marketData }),
          ...(layerMarketData && { layerMarket: layerMarketData }),
        };
      })
      .catch((err) => {
        const errorParams = {
          ...defaultError,
          message: 'API put error (placement.editPlacementMarketsLayers)',
        };

        utils.api.handleError(err, errorParams);
        utils.api.handleUnauthorized(err, dispatch, authLogout);
        dispatch(editPlacementMarketFailure(err));
        dispatch(enqueueNotification('notification.editPlacementMarketsLayers.fail', 'error'));
        if (closeModal) {
          dispatch(hideModal());
        }
        dispatch(removeLoader('editPlacementMarketsLayers'));
        return err;
      });
  };

export const editPlacementMarketRequest = (data) => {
  return {
    type: 'PLACEMENT_MARKET_EDIT_REQUEST',
    payload: data,
  };
};

export const editPlacementMarketSuccess = (data) => {
  return {
    type: 'PLACEMENT_MARKET_EDIT_SUCCESS',
    payload: data,
  };
};

export const editPlacementMarketFailure = (error) => {
  return {
    type: 'PLACEMENT_MARKET_EDIT_FAILURE',
    payload: error,
  };
};

export const editPlacementLayerMarketSuccess = (responseData) => {
  return {
    type: 'PLACEMENT_LAYER_MARKET_EDIT_SUCCESS',
    payload: responseData,
  };
};
