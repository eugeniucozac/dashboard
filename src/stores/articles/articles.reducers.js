const initialState = {
  list: {
    items: [],
    topics: [],
    page: 0,
    pageSize: 25,
    itemsTotal: 100,
  },
  initialLoad: false,
  isLoading: false,
};

const articlesReducers = (state = initialState, action) => {
  switch (action.type) {
    case 'ARTICLES_GET_REQUEST':
      return {
        ...state,
        isLoading: true,
      };
    case 'ARTICLES_GET_SUCCESS':
      return {
        ...state,
        list: {
          ...state.list,
          ...action.payload,
        },
        isLoading: false,
      };
    case 'ARTICLES_UPDATE_TOPICS_SUCCESS':
      return {
        ...state,
        list: {
          ...state.list,
          topics: action.payload || [],
        },
      };
    case 'ARTICLES_INITIAL_LOAD_SUCCESS':
      return {
        ...state,
        initialLoad: true,
      };
    default:
      return state;
  }
};

export default articlesReducers;
