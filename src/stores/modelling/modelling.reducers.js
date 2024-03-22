import config from 'config';
import * as utils from 'utils';

const initialState = {
  selected: {},
  list: {
    items: [],
    itemsTotal: 0,
    page: 1,
    pageSize: config.ui.pagination.default,
    pageTotal: 0,
    sortBy: 'dueDate',
    sortType: 'text',
    sortDirection: 'desc',
  },
  create: false,
};

const modellingReducers = (state = initialState, action) => {
  switch (action.type) {
    case 'MODELLING_GET_SUCCESS':
    case 'MODELLING_PUT_SUCCESS':
      return {
        ...state,
        selected: { ...action.payload },
      };
    case 'MODELLING_POST_SUCCESS':
      return {
        ...state,
        selected: { ...action.payload },
        create: true,
      };
    case 'MODELLING_RESET':
      return {
        ...state,
        selected: {},
      };
    case 'MODELLING_RESET_CREATE_FLAG':
      return {
        ...state,
        create: false,
      };
    case 'MODELLING_LIST_GET_SUCCESS':
      return {
        ...state,
        list: {
          ...state.list,
          items: action.payload.content,
          ...utils.api.pagination(action.payload),
        },
      };
    case 'MODELLING_LIST_RESET':
      return {
        ...state,
        list: { ...initialState.list },
      };
    default:
      return state;
  }
};

export default modellingReducers;
