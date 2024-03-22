export const deselectPlacement = () => {
  return {
    type: 'PLACEMENT_DESELECT',
  };
};

// policies
export const deletePlacementPolicies = (policyIds) => {
  return {
    type: 'PLACEMENT_POLICIES_DELETE',
    payload: policyIds,
  };
};

export const deletePlacementPolicyMarkets = (policyMarketArray) => {
  return {
    type: 'PLACEMENT_POLICY_MARKETS_DELETE',
    payload: policyMarketArray,
  };
};

export const updatePlacementPolicyMarkets = (policyMarketArray) => {
  return {
    type: 'PLACEMENT_POLICY_MARKETS_UPDATE',
    payload: policyMarketArray,
  };
};

// layers
export const deletePlacementLayers = (layerIds) => {
  return {
    type: 'PLACEMENT_LAYERS_DELETE',
    payload: layerIds,
  };
};

export const deletePlacementLayerMarkets = (layerMarketArray) => {
  return {
    type: 'PLACEMENT_LAYER_MARKETS_DELETE',
    payload: layerMarketArray,
  };
};

export const updatePlacementLayerMarkets = (layerMarketArray) => {
  return {
    type: 'PLACEMENT_LAYER_MARKETS_UPDATE',
    payload: layerMarketArray,
  };
};

export const updatePlacementLayers = (layers) => {
  return {
    type: 'PLACEMENT_LAYERS_UPDATE',
    payload: layers,
  };
};
