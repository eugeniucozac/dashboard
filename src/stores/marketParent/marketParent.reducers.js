import toNumber from 'lodash/toNumber';

// app
import config from 'config';
import * as utils from 'utils';

const initialState = {
  listAll: {
    items: [],
  },
  list: {
    items: [],
    itemsTotal: 0,
    page: 1,
    pageSize: config.ui.pagination.default,
    pageTotal: 0,
    sortBy: 'name',
    sortDirection: 'asc',
  },
  placements: [],
  selected: null,
};

const marketParentReducers = (state = initialState, action) => {
  switch (action.type) {
    case 'MARKET_PARENT_GET_SUCCESS':
      return {
        ...state,
        placements: [],
        selected: action.payload.marketParent,
      };

    case 'MARKET_PARENT_LIST_GET_SUCCESS':
      return {
        ...state,
        list: {
          ...state.list,
          items: action.payload.content,
          ...utils.api.pagination(action.payload),
        },
      };

    case 'MARKET_PARENT_LIST_ALL_GET_SUCCESS':
      return {
        ...state,
        listAll: {
          items: action.payload,
        },
      };

    case 'MARKET_PARENT_EDIT_MARKETS_SUCCESS':
      return {
        ...state,
        list: {
          ...state.list,
          items: state.list.items.map((item) => {
            if (item.id === action.payload.id) {
              return action.payload;
            }
            return item;
          }),
        },
      };

    case 'MARKET_PARENT_LIST_GET_ALL_FAILURE':
      return {
        ...state,
        listAll: initialState.listAll,
      };

    case 'MARKET_PARENT_PLACEMENTS_GET_SUCCESS':
      return {
        ...state,
        selected: state.listAll.items.find((marketParent) => toNumber(marketParent.id) === toNumber(action.payload.marketParentId)),
        placements: action.payload.placements,
      };

    default:
      return state;
  }
};

export default marketParentReducers;
