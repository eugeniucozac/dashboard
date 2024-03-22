import { addLoader, authLogout, removeLoader } from 'stores';
import * as utils from 'utils';
import get from 'lodash/get';

export const postClaimsProcessingFilters = (params) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}, claims} = getState();

  const defaultError = {
    file: 'stores/claims.actions.postClaimsProcessingFilters',
  };

  dispatch(postClaimsProcessingFiltersRequest());
  dispatch(addLoader('postClaimsProcessingFilters'));

  const prevDirection = get(claims, 'processing.sort.direction') || '';
  const newDirection = params.hasOwnProperty('direction') ? params.direction : prevDirection;

  const prevQuery = get(claims, 'processing.query') || '';
  const newQuery = params.hasOwnProperty('term') ? params.term : prevQuery;

  const prevSortBy = get(claims, 'processing.sort.by') || '';
  const newSortBy = params.hasOwnProperty('sortBy') ? params.sortBy : prevSortBy;

  const data = {
    direction: newDirection,
    page: (params && params.page) || 0,
    pageSize: (params && params.size) || claims.processing.pageSize,
    search: newQuery,
    sortBy: newSortBy,
  };

  return utils.api
    .post({
      token: auth.accessToken,
      endpoint: endpoint.claimService,
      path: 'api/data/claimsProcessing/search/filter-values',
      data,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((data) => {
      dispatch(postClaimsProcessingFiltersSuccess(data.data));
      dispatch(removeLoader('postClaimsProcessingFilters'));
      return data;
    })
    .catch((err) => {
      dispatch(postClaimsProcessingFiltersFailure(err, defaultError));
      dispatch(removeLoader('postClaimsProcessingFilters'));
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      return err;
    });
};

export const postClaimsProcessingFiltersRequest = (data) => {
  return {
    type: 'CLAIMS_PROCESSING_FILTERS_POST_REQUEST',
    payload: data,
  };
};

export const postClaimsProcessingFiltersSuccess = (data) => {
  return {
    type: 'CLAIMS_PROCESSING_FILTERS_POST_SUCCESS',
    payload: data,
  };
};

export const postClaimsProcessingFiltersFailure = (data) => {
  return {
    type: 'CLAIMS_PROCESSING_FILTER_POST_ERROR',
    payload: data,
  };
};
