import * as utils from 'utils';

const initialState = {
  term: '',
  queue: [],
  results: {},
  resultsTerm: '',
  isLoading: false,
  error: '',
};

const searchReducers = (state = initialState, action) => {
  switch (action.type) {
    case 'SEARCH_GET_REQUEST':
      return {
        ...state,
        term: action.payload,
        queue: [...state.queue, action.payload],
        isLoading: true,
      };

    case 'SEARCH_GET_SUCCESS':
      // this is to make sure this response matches the last query that was triggered
      const searchSuccessTermMatch = action.payload.term && state.term === action.payload.term;
      const searchSuccessQueue = state.queue.filter((q) => q !== action.payload.term);

      return {
        ...state,
        queue: searchSuccessQueue,
        results: searchSuccessTermMatch ? action.payload.results : state.results,
        resultsTerm: searchSuccessTermMatch ? action.payload.term : state.resultsTerm,
        isLoading: searchSuccessQueue.length > 0,
      };

    case 'SEARCH_GET_FAILURE':
      const searchFailureTermMatch = action.payload.term && state.term === action.payload.term;
      const searchFailureQueue = state.queue.filter((q) => q !== action.payload.term);

      return {
        ...state,
        queue: searchFailureQueue,
        results: searchFailureTermMatch ? {} : state.results,
        isLoading: searchFailureQueue.length > 0,
        error: searchFailureTermMatch ? utils.string.t('advancedSearch.fetchError') : state.error,
      };

    case 'SEARCH_RESET':
      return {
        ...initialState,
      };

    default:
      return state;
  }
};

export default searchReducers;
