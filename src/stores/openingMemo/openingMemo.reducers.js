import config from 'config';
import * as utils from 'utils';

const initialState = {
  list: {
    items: [],
    itemsTotal: 0,
    page: 1,
    pageSize: config.ui.pagination.default,
    pageTotal: 0,
    sortBy: 'id',
    sortType: 'text',
    sortDirection: 'desc',
    status: '',
  },
  selected: {},
  dirty: false,
};

const openingMemoReducers = (state = initialState, action) => {
  switch (action.type) {
    case 'OPENING_MEMO_GET_SUCCESS':
    case 'OPENING_MEMO_PUT_SUCCESS':
    case 'OPENING_MEMO_PATCH_SUCCESS':
      return {
        ...state,
        selected: { ...action.payload },
      };
    case 'OPENING_MEMO_POST_SUCCESS':
      return {
        ...state,
        selected: { ...action.payload },
        postSuccess: true,
      };
    case 'OPENING_MEMO_PLACEMENT_LIST_GET_SUCCESS':
      return {
        ...state,
        list: {
          ...state.list,
          items: action.payload.content,
          ...utils.api.pagination(action.payload),
        },
      };
    case 'OPENING_MEMO_PLACEMENT_FILTER_STATUS':
      return {
        ...state,
        list: {
          ...state.list,
          status: action.payload,
        },
      };
    case 'OPENING_MEMO_UPDATE_SUCCESS':
      return {
        ...state,
        selected: { ...state.selected, ...action.payload },
      };
    case 'RESET_OPENING_MEMO':
      return {
        ...state,
        selected: {},
        dirty: false,
      };
    case 'RESET_OPENING_MEMO_LIST':
      return {
        ...state,
        list: { ...initialState.list },
      };
    case 'RESET_OPENING_MEMO_POST_SUCCESS':
      return {
        ...state,
        selected: {},
        postSuccess: false,
      };
    case 'UPDATE_DIRTY_OPENING_MEMO':
      return {
        ...state,
        dirty: action.payload,
      };
    default:
      return state;
  }
};

export default openingMemoReducers;
