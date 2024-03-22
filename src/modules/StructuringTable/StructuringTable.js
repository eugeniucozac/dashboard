import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import get from 'lodash/get';
import has from 'lodash/has';
import useMediaQuery from '@material-ui/core/useMediaQuery';

// app
import { StructuringTableView } from './StructuringTable.view';
import { Translate } from 'components';
import {
  bulkPlacementLayerToggle,
  bulkPlacementMarketToggle,
  deletePlacementLayer,
  deletePlacementLayerMarket,
  selectLayerMarket,
  showModal,
  selectPlacementBulkType,
  selectPlacementMarkets,
  selectMarketSelectedId,
  selectRefDataCapacityTypes,
  selectRefDataStatusIdByCode,
  selectRefDataStatusKeyByCode,
  selectBulkToggleSelect,
  selectPlacementBulkItemsLayers,
  selectPlacementBulkItemsMarkets,
  selectRefDataStatusesMarketQuote,
} from 'stores';
import { STATUS_POLICY_NTU } from 'consts';

StructuringTable.propTypes = {
  layers: PropTypes.array.isRequired,
  commentIDs: PropTypes.array,
  rowLimit: PropTypes.number,
  printView: PropTypes.bool,
  showHeaderRow: PropTypes.bool,
};

StructuringTable.defaultProps = {
  printView: false,
  showHeaderRow: true,
};

export default function StructuringTable({ layers, commentIDs, rowLimit, printView, showHeaderRow }) {
  const dispatch = useDispatch();

  const placementBulkType = useSelector(selectPlacementBulkType);
  const placementMarkets = useSelector(selectPlacementMarkets);
  const marketSelectedId = useSelector(selectMarketSelectedId);
  const refDataCapacityTypes = useSelector(selectRefDataCapacityTypes);
  const statusPolicyNtuId = useSelector(selectRefDataStatusIdByCode('policy', STATUS_POLICY_NTU));
  const statusPolicyNtuLabel = useSelector(selectRefDataStatusKeyByCode('policy', STATUS_POLICY_NTU));
  const showBulkSelect = useSelector(selectBulkToggleSelect);
  const placementBulkItemsLayers = useSelector(selectPlacementBulkItemsLayers);
  const placementBulkItemsLayerMarkets = useSelector(selectPlacementBulkItemsMarkets);
  const policyMarketQuoteStatuses = useSelector(selectRefDataStatusesMarketQuote);

  const handleEditLayer = (popoverData) => {
    dispatch(
      showModal({
        component: 'EDIT_PLACEMENT_LAYER',
        props: {
          title: 'placement.marketing.editLayer',
          subtitle: popoverData.title,
          fullWidth: true,
          maxWidth: 'sm',
          componentProps: {
            layer: popoverData.layer,
          },
        },
      })
    );
  };

  const handleDeleteLayer = (popoverData) => {
    dispatch(
      showModal({
        component: 'CONFIRM_DELETE',
        props: {
          title: 'placement.marketing.deleteLayer',
          subtitle: popoverData.title,
          fullWidth: true,
          maxWidth: 'xs',
          disableAutoFocus: true,
          componentProps: {
            submitHandler: () => {
              dispatch(deletePlacementLayer(get(popoverData, 'layer.id')));
            },
          },
        },
      })
    );
  };

  const handleAddLayerMarket = (popoverData) => {
    dispatch(
      showModal({
        component: 'ADD_PLACEMENT_LAYER_MARKET',
        props: {
          title: 'placement.marketing.addMarket',
          subtitle: popoverData.title,
          fullWidth: true,
          maxWidth: 'sm',
          disableAutoFocus: true,
          componentProps: {
            layer: popoverData.layer,
            placementMarkets,
          },
        },
      })
    );
  };

  const handleDuplicateLayerMarket = (popoverData) => {
    dispatch(
      showModal({
        component: 'ADD_PLACEMENT_LAYER_MARKET',
        props: {
          title: 'placement.marketing.duplicateLayerMarket',
          subtitle: popoverData.title,
          fullWidth: true,
          maxWidth: 'sm',
          disableAutoFocus: true,
          componentProps: {
            isDuplicateMarket: true,
            layer: popoverData?.layer,
            placementMarkets,
            line: popoverData?.layerMarket,
          },
        },
      })
    );
  };

  const handleDeleteLayerMarket = (popoverData) => {
    dispatch(
      showModal({
        component: 'CONFIRM_DELETE',
        props: {
          title: 'placement.marketing.deleteLayerMarket',
          subtitle: popoverData.title,
          fullWidth: true,
          maxWidth: 'xs',
          disableAutoFocus: true,
          componentProps: {
            submitHandler: () => {
              dispatch(deletePlacementLayerMarket(get(popoverData, 'layerMarket.id')));
            },
          },
        },
      })
    );
  };

  const handleEditLayerMarket = (popoverData) => {
    const marketId = popoverData.layerMarket?.market?.id;

    dispatch(
      showModal({
        component: 'EDIT_PLACEMENT_MARKETS_LAYERS',
        props: {
          fullWidth: false,
          maxWidth: 'lg',
          title: 'placement.marketing.manageMarket',
          componentProps: {
            placementLayer: popoverData.layer,
            placementMarket: placementMarkets.find((m) => m.market?.id === marketId),
          },
        },
      })
    );
  };

  const handleToggleMarket = (marketId) => (event) => {
    dispatch(selectLayerMarket(marketId));
  };

  const handleBulkSelectLayer = (selected, layerId, marketList) => (event) => {
    event.stopPropagation();
    dispatch(bulkPlacementLayerToggle(selected, layerId, marketList));
  };

  const handleBulkSelectMarket = (layerId, marketId) => (event) => {
    event.stopPropagation();
    dispatch(bulkPlacementMarketToggle(layerId, marketId));
  };

  const getSelectedBulkMarketsByLayer = (layer) => {
    const markets = get(layer, 'markets') || [];
    return markets.filter((marketObj) => {
      return has(marketObj, 'id') && placementBulkItemsLayerMarkets.includes(marketObj.id);
    });
  };

  const layerTitleWidth = useMediaQuery('(max-width:1400px)');

  const cols = [
    { id: 'layer', title: true, ...(layerTitleWidth && { width: 250 }) },
    { id: 'umr', label: <Translate label="placement.generic.umr" />, align: 'center', width: 120 },
    { id: 'section', label: <Translate label="placement.generic.section" />, align: 'center', compact: true, width: 80 },
    { id: 'premium', label: <Translate label="placement.generic.premium" />, align: 'center', compact: true, width: 100 },
    { id: 'written', label: <Translate label="placement.generic.written" />, align: 'center', compact: true, width: 80 },
    { id: 'status', label: <Translate label="placement.generic.status" />, align: 'center', compact: true, width: 80 },
    { id: 'comments', align: 'center', compact: true, width: 24 },
    { id: 'actions', menu: true, width: 24, style: { paddingLeft: 0, paddingRight: 0 } },
  ];

  return (
    <StructuringTableView
      layers={layers}
      commentIDs={commentIDs}
      marketSelectedId={marketSelectedId}
      cols={cols}
      capacityTypes={refDataCapacityTypes}
      rowLimit={rowLimit}
      printView={printView}
      showHeaderRow={showHeaderRow}
      showBulkSelect={showBulkSelect}
      statuses={{
        policyNtu: {
          id: statusPolicyNtuId,
          key: statusPolicyNtuLabel,
        },
        policyMarketQuoteStatuses,
      }}
      bulk={{
        type: placementBulkType,
        items: placementBulkItemsLayers,
        itemsMarkets: placementBulkItemsLayerMarkets,
      }}
      handlers={{
        bulkSelectLayer: handleBulkSelectLayer,
        bulkSelectMarket: handleBulkSelectMarket,
        editLayer: handleEditLayer,
        deleteLayer: handleDeleteLayer,
        addLayerMarket: handleAddLayerMarket,
        editLayerMarket: handleEditLayerMarket,
        deleteLayerMarket: handleDeleteLayerMarket,
        getSelectedBulkMarketsByLayer,
        toggleMarket: handleToggleMarket,
        duplicateLayerMarket: handleDuplicateLayerMarket,
      }}
    />
  );
}
