import get from 'lodash/get';

const initialState = {
  selected: null,
  list: [],
  listFetched: false,
  offices: [],
  placements: [],
  placementsFetched: false,
  loading: {
    selected: false,
    list: false,
    offices: false,
    placements: false,
  },
};

const parentReducers = (state = initialState, action) => {
  switch (action.type) {
    case 'PARENT_GET_REQUEST':
      return {
        ...state,
        loading: {
          ...state.loading,
          selected: true,
          offices: true,
        },
      };

    case 'PARENT_GET_SUCCESS':
      const { offices, ...rest } = action.payload;

      return {
        ...state,
        offices: offices,
        selected: rest,
        placements: [],
        loading: {
          ...state.loading,
          selected: false,
          offices: false,
        },
      };

    case 'PARENT_GET_FAILURE':
      return {
        ...state,
        selected: initialState.selected,
        offices: initialState.offices,
        placements: initialState.placements,
        loading: {
          ...state.loading,
          selected: false,
          offices: false,
        },
      };

    case 'PARENT_PLACEMENTS_GET_REQUEST':
      return {
        ...state,
        placementsFetched: false,
        loading: {
          ...state.loading,
          placements: true,
        },
      };

    case 'PARENT_PLACEMENTS_GET_SUCCESS':
      const placements = get(action.payload, 'content');

      return {
        ...state,
        placements: placements.length > 0 ? placements : initialState.placements,
        placementsFetched: true,
        loading: {
          ...state.loading,
          placements: false,
        },
      };

    case 'PARENT_PLACEMENTS_GET_FAILURE':
      return {
        ...state,
        placements: initialState.placements,
        placementsFetched: true,
        loading: {
          ...state.loading,
          placements: false,
        },
      };

    case 'PARENT_DELETE_PLACEMENTS':
      return {
        ...state,
        placements: initialState.placements,
        placementsFetched: false,
      };

    case 'PARENT_LIST_GET_REQUEST':
      return {
        ...state,
        listFetched: false,
        loading: {
          ...state.loading,
          list: true,
        },
      };

    case 'PARENT_LIST_GET_SUCCESS':
      const list = get(action.payload, 'content');

      return {
        ...state,
        list: list.length > 0 ? list : initialState.list,
        listFetched: true,
        loading: {
          ...state.loading,
          list: false,
        },
      };

    case 'PARENT_LIST_GET_FAILURE':
      return {
        ...state,
        list: initialState.list,
        listFetched: true,
        loading: {
          ...state.loading,
          list: false,
        },
      };

    default:
      return state;
  }
};

export default parentReducers;
