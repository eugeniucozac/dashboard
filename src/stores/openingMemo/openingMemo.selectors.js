import get from 'lodash/get';

export const selectOpeningMemo = (state) => get(state, 'openingMemo.selected') || {};
export const selectOpeningMemoPostSuccess = (state) => get(state, 'openingMemo.postSuccess') || false;
export const selectOpeningMemoList = (state) => get(state, 'openingMemo.list') || {};
export const selectOpeningMemoListItems = (state) => get(state, 'openingMemo.list.items') || [];
