import get from 'lodash/get';

export const selectMarketSelected = (state) => get(state, 'market.selected');
export const selectMarketSelectedId = (state) => get(state, 'market.selected.id');
