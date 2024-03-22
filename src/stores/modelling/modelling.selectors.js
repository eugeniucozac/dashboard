import get from 'lodash/get';

export const selectModellingTask = (state) => get(state, 'modelling.selected') || {};
export const selectModellingList = (state) => get(state, 'modelling.list') || {};
export const selectModellingCreateFlag = (state) => get(state, 'modelling.create') || false;
