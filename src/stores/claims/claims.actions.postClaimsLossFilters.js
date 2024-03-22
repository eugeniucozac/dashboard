import { addLoader, authLogout, removeLoader } from 'stores';
import * as utils from 'utils';
import get from 'lodash/get';

export const postClaimsLossFilters = (params) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}, claims} = getState();

  const defaultError = {
    file: 'stores/claims.actions.postClaimsLossFilters',
  };

  dispatch(postClaimsLossFiltersRequest());
  dispatch(addLoader('postClaimsLossFilters'));

  const prevDirection = get(claims, 'claims.sort.direction') || '';
  const newDirection = params.hasOwnProperty('direction') ? params.direction : prevDirection;

  const prevQuery = get(claims, 'claims.query') || '';
  const newQuery = params.hasOwnProperty('term') ? params.term : prevQuery;

  const prevSortBy = get(claims, 'claims.sort.by') || '';
  const newSortBy = params.hasOwnProperty('sortBy') ? params.sortBy : prevSortBy;

  const prevSearchBy = get(claims, 'claims.searchBy') || '';
  const newSearchBy = params.hasOwnProperty('searchBy') ? params.searchBy : prevSearchBy;

  const data = {
    direction: newDirection,
    page: (params && params.page) || 0,
    pageSize: (params && params.size) || claims.claims.pageSize,
    search: newQuery,
    sortBy: newSortBy,
    searchBy: newSearchBy,
  };

  return utils.api
    .post({
      token: auth.accessToken,
      endpoint: endpoint.claimService,
      path: 'api/data/claims/search/filter-values',
      data,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((data) => {
      dispatch(postClaimsLossFiltersSuccess(data.data));
      dispatch(removeLoader('postClaimsLossFilters'));
      return data;
    })
    .catch((err) => {
      dispatch(postClaimsLossFiltersFailure(err, defaultError));
      dispatch(removeLoader('postClaimsLossFilters'));
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      return err;
    });
};

export const postClaimsLossFiltersRequest = (data) => {
  return {
    type: 'CLAIMS_LOSS_FILTERS_POST_REQUEST',
    payload: data,
  };
};

export const postClaimsLossFiltersSuccess = (data) => {
  return {
    type: 'CLAIMS_LOSS_FILTERS_POST_SUCCESS',
    payload: data,
  };
};

export const postClaimsLossFiltersFailure = (data) => {
  return {
    type: 'CLAIMS_LOSS_FILTER_POST_ERROR',
    payload: data,
  };
};
