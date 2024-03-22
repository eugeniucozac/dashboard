export const resetOpeningMemo = () => ({
  type: 'RESET_OPENING_MEMO',
});

export const resetOpeningMemoList = () => ({
  type: 'RESET_OPENING_MEMO_LIST',
});

export const updateOpeningMemoDirty = (payload) => ({
  type: 'UPDATE_DIRTY_OPENING_MEMO',
  payload,
});

export const updateOpeningMemoFilterByStatus = (payload) => {
  return {
    type: 'OPENING_MEMO_PLACEMENT_FILTER_STATUS',
    payload,
  };
};
