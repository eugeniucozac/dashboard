import get from 'lodash/get';
import * as utils from 'utils';

export const resetMarket = () => (dispatch) => {
  dispatch({ type: 'MARKET_RESET' });
};

// policies
export const selectPolicyMarket = (marketId) => (dispatch, getState) => {
  const policies = get(getState(), 'placement.selected.policies', []) || [];
  const market = utils.policies.getMarketById(policies, marketId);

  dispatch({
    type: 'MARKET_POLICY_SELECT',
    payload: {
      ...market,
    },
  });
};

export const updateSelectedPolicyMarket = () => (dispatch, getState) => {
  const policies = get(getState(), 'placement.selected.policies', []) || [];
  const marketId = get(getState(), 'market.selected.id');
  const market = utils.policies.getMarketById(policies, marketId);

  dispatch({
    type: 'MARKET_POLICY_SELECT',
    payload: market,
  });
};

// layers
export const selectLayerMarket = (marketId) => (dispatch, getState) => {
  const layers = get(getState(), 'placement.selected.layers', []) || [];
  const market = utils.layers.getMarketById(layers, marketId);

  dispatch({
    type: 'MARKET_LAYER_SELECT',
    payload: {
      ...market,
    },
  });
};

export const updateSelectedLayerMarket = () => (dispatch, getState) => {
  const layers = get(getState(), 'placement.selected.layers', []) || [];
  const marketId = get(getState(), 'market.selected.id');
  const market = utils.layers.getMarketById(layers, marketId);

  dispatch({
    type: 'MARKET_LAYER_SELECT',
    payload: market,
  });
};
