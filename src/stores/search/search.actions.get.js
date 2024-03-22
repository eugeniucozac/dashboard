import { authLogout } from 'stores';
import * as utils from 'utils';
import isString from 'lodash/isString';
import get from 'lodash/get';

export const getSearchResults = (term) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}} = getState();
  const prevSearchTerm = get(getState(), 'search.resultsTerm');

  // abort
  if (!term || !isString(term) || term.trim() === prevSearchTerm) return;
  const searchTerm = term.trim();

  dispatch(getSearchRequest(searchTerm));

  return utils.api
    .get({
      token: auth.accessToken,
      endpoint: endpoint.edge,
      path: `api/search?name=${encodeURIComponent(searchTerm)}&limit=8`,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((data) => {
      dispatch(getSearchSuccess(data, searchTerm));
      return data;
    })
    .catch((err) => {
      const errorParams = {
        file: 'stores/search.actions.get',
        message: 'API fetch error (search.get)',
      };

      utils.api.handleError(err, errorParams);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(getSearchFailure(err, searchTerm));
      return err;
    });
};

export const getSearchRequest = (searchTerm) => {
  return {
    type: 'SEARCH_GET_REQUEST',
    payload: searchTerm,
  };
};

export const getSearchSuccess = (data, searchTerm) => {
  return {
    type: 'SEARCH_GET_SUCCESS',
    payload: {
      results: data && data.results,
      term: searchTerm,
    },
  };
};

export const getSearchFailure = (error, searchTerm) => {
  return {
    type: 'SEARCH_GET_FAILURE',
    payload: {
      error,
      term: searchTerm,
    },
  };
};
