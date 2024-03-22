import { authLogout, addLoader, removeLoader } from 'stores';
import * as utils from 'utils';
import get from 'lodash/get';
import { isEmpty } from 'lodash';

export const getClaims =
  (params = {}) =>
  (dispatch, getState) => {
    // prettier-ignore
    const { user: { auth }, config: { vars: { endpoint }}, claims} = getState();

    const defaultError = {
      file: 'stores/claims.actions.getClaims',
    };

    const prevDirection = get(claims, 'claims.sort.direction') || '';
    const newDirection = params.hasOwnProperty('direction') ? params.direction : prevDirection;

    const prevQuery = get(claims, 'claims.query') || '';
    const newQuery = params.hasOwnProperty('term') ? params.term : prevQuery;

    const prevFilterQuery = get(claims, 'claimLossSearchFilters.filters') || {};
    const newFilterQuery = params.hasOwnProperty('filterTerm') && params.filterTerm !== '' ? params.filterTerm : prevFilterQuery;

    const prevSortBy = get(claims, 'claims.sort.by') || '';
    const newSortBy = params.hasOwnProperty('sortBy') ? params.sortBy : prevSortBy;

    const prevSearchBy = get(claims, 'claims.searchBy') || '';
    const newSearchBy = params.hasOwnProperty('searchBy') ? params.searchBy : prevSearchBy;

    const filterSearchValues = Object.fromEntries(Object.entries(newFilterQuery).filter((item) => !isEmpty(item[1])));

    const postBody = {
      page: (params && params.page) || 0,
      pageSize: (params && params.size) || claims.claims.pageSize,
      search: newQuery,
      sortBy: newSortBy,
      searchBy: newSearchBy,
      direction: newDirection?.toUpperCase(),
      filterSearch: null,
      filterLossClaimsCriteria: !isEmpty(filterSearchValues) ? filterSearchValues : null,
    };

    dispatch(getClaimsRequest(params));
    dispatch(addLoader('getClaims'));

    return utils.api
      .post({
        token: auth.accessToken,
        endpoint: endpoint.claimService,
        path: 'api/data/claims/search',
        data: postBody,
      })
      .then((response) => utils.api.handleResponse(response))
      .then((data) => {
        dispatch(getClaimsSuccess(data));
        dispatch(removeLoader('getClaims'));
        return data;
      })
      .catch((err) => {
        dispatch(getClaimsFailure(err, defaultError));
        dispatch(removeLoader('getClaims'));
        utils.api.handleUnauthorized(err, dispatch, authLogout);
        return err;
      });
  };

export const getClaimsRequest = (params) => {
  return {
    type: 'CLAIMS_GET_REQUEST',
    payload: params,
  };
};

export const getClaimsSuccess = (data) => {
  return {
    type: 'CLAIMS_GET_SUCCESS',
    payload: {
      items: data.data,
      pagination: data.pagination,
    },
  };
};

export const getClaimsFailure = (error) => {
  return {
    type: 'CLAIMS_GET_FAILURE',
    payload: error,
  };
};
