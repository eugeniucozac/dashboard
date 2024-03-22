import { authLogout } from 'stores';
import * as utils from 'utils';
import get from 'lodash/get';
import { isEmpty } from 'lodash';

export const getSearchLosses =
  (params = {}) =>
  (dispatch, getState) => {
    // prettier-ignore
    const { user: { auth }, config: { vars: { endpoint }}, claims} = getState();

    const defaultError = {
      file: 'stores/claims.actions.getSearchLosses',
    };

    const prevDirection = get(claims, 'lossesTab.sort.direction') || '';
    const newDirection = params.hasOwnProperty('direction') ? params.direction : prevDirection;

    const prevQuery = get(claims, 'lossesTab.query') || '';
    const newQuery = params.hasOwnProperty('term') ? params.term : prevQuery;

    
    const prevSortBy = get(claims, 'lossesTab.sort.by') || '';
    const newSortBy = params.hasOwnProperty('sortBy') ? params.sortBy : prevSortBy;

    const prevSearchBy = get(claims, 'lossesTab.searchBy') || '';
    const newSearchBy = prevSearchBy === '' && params.hasOwnProperty('searchBy') && params.searchBy === '' ? 'lossName' : params.hasOwnProperty('searchBy') ? params.searchBy : prevSearchBy;
    
    const constructFilters = (filtersObj) => {
        const filteredArray = [];
        for (const key in filtersObj) {
            if (filtersObj[key]?.length > 0 && typeof filtersObj[key] !== 'string') {
            filteredArray.push({
                column: key,
                filterValue: filtersObj[key],
            });
            } else if (typeof filtersObj[key] === 'string' && filtersObj[key] !== '') {
            filteredArray.push({
                column: key,
                filterValue: [{id: 0, name: filtersObj[key]}],
            });
            }
        }
        return filteredArray;
    };

    const prevFilterQuery = get(claims, 'lossesTab.filterValues') || {};
    const newFilterQuery = params.hasOwnProperty('filterTerm') && params.filterTerm !== '' ? constructFilters(params.filterTerm) : constructFilters(prevFilterQuery?.filters);
    
    const postBody = {
      requestType: params?.requestType,
      page: (params && params.page) || 0,
      pageSize: (params && params.size) || claims.lossesTab.pageSize,
      search: newQuery,
      sortBy: newSortBy,
      searchBy: newSearchBy,
      direction: newDirection?.toUpperCase(),
      filterSearch: !isEmpty(newFilterQuery) ? newFilterQuery : null,
      filterLossClaimsCriteria: null,
    };

    dispatch(getSearchLossesRequest(params));

    return utils.api
      .post({
        token: auth.accessToken,
        endpoint: endpoint.claimService,
        path: 'api/data/loss/search',
        data: postBody,
      })
      .then((response) => utils.api.handleResponse(response))
      .then((data) => {
        dispatch(getSearchLossesSuccess(data, params?.requestType));
        return data;
      })
      .catch((err) => {
        dispatch(getSearchLossesFailure(err, defaultError));
        utils.api.handleUnauthorized(err, dispatch, authLogout);
        return err;
      });
  };

export const getSearchLossesRequest = (params) => {
  return {
    type: 'LOSSES_TAB_POST_REQUEST',
    payload: params,
  };
};

export const getSearchLossesSuccess = (data, requestType) => {
  let requestedItem;
  if(requestType==='search'){
    requestedItem = {
      items: data.data.searchValue,
      requestType: requestType,
      pagination: data.pagination,
    }
  }
  if(requestType==='filter'){
    requestedItem = {
      items: data.data.filterValue,
      requestType: requestType
    }
  }
  return {
    type: 'LOSSES_TAB_POST_SUCCESS',
    payload: requestedItem,
  };
};

export const getSearchLossesFailure = (error) => {
  return {
    type: 'LOSSES_TAB_POST_FAILURE',
    payload: error,
  };
};
