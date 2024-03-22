import get from 'lodash/get';

export const selectDepartmentMarketsItems = (state) => get(state, 'department.markets.items') || [];
export const selectDepartmentMarket = (state) => get(state, 'department.market') || {};
