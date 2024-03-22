export const bulkPlacementToggle = (type, id) => {
  return {
    type: 'PLACEMENT_BULK_TOGGLE',
    payload: { type, id },
  };
};

export const bulkPlacementClear = () => {
  return {
    type: 'PLACEMENT_BULK_CLEAR',
  };
};

export const bulkPlacementLayerToggle = (selected, layerId, marketList) => {
  const marketIdList = marketList && marketList.map((market) => market.id);
  return {
    type: 'PLACEMENT_BULK_TOGGLE_LAYER',
    payload: { selected, layerId, marketIdList },
  };
};
export const bulkPlacementMarketToggle = (layerId, marketId) => {
  return {
    type: 'PLACEMENT_BULK_TOGGLE_MARKET',
    payload: { layerId, marketId },
  };
};

export const bulkPlacementClearAll = () => {
  return {
    type: 'PLACEMENT_BULK_CLEAR_ALL',
  };
};
export const bulkToggleSelect = () => {
  return {
    type: 'BULK_SELECT_TOGGLE',
  };
};
export const disableBulkToggleSelect = () => {
  return {
    type: 'BULK_SELECT_TOGGLE_DISABLE',
  };
};
