import get from 'lodash/get';

export const selectSearchResults = (state) => {
  return get(state, 'search.results') || {};
};

export const selectSearchTerm = (state) => {
  return get(state, 'search.term') || '';
};

export const selectSearchResultsTerm = (state) => {
  return get(state, 'search.resultsTerm') || '';
};

export const selectSearchIsLoading = (state) => {
  return get(state, 'search.isLoading') === true;
};

export const selectSearchError = (state) => {
  return get(state, 'search.error') || '';
};
