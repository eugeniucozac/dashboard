import { authLogout } from 'stores';
import * as utils from 'utils';
import { REQ_TYPES, ADVANCE_SEARCH_SEARCH_BY } from 'consts';
import get from 'lodash/get';
import { isEmpty } from 'lodash';

export const getAdvanceSearchDetails =
  (params = {}) =>
  (dispatch, getState) => {
    // prettier-ignore
    const { user: { auth }, config: { vars: { endpoint }}, claims} = getState();

    const defaultError = {
      file: 'stores/claims.actions.getAdvanceSearchDetails',
    };

    const prevDirection = get(claims, 'advanceTab.sort.direction') || '';
    const newDirection = params.hasOwnProperty('direction') ? params.direction : prevDirection;

    const prevQuery = get(claims, 'advanceTab.query') || '';
    const newQuery = params.hasOwnProperty('term') ? params.term : prevQuery;

    const prevSortBy = get(claims, 'advanceTab.sort.by') || '';
    const newSortBy = params.hasOwnProperty('sortBy') ? params.sortBy : prevSortBy;

    const prevSearchBy = get(claims, 'advanceTab.searchBy') || '';
    const newSearchBy =
      prevSearchBy === '' && params.hasOwnProperty('searchBy') && params.searchBy === ''
        ? ADVANCE_SEARCH_SEARCH_BY
        : params.hasOwnProperty('searchBy')
        ? params.searchBy
        : prevSearchBy;

    const prevPullClosedRecords = get(claims, 'advanceTab.pullClosedRecords') || false;
    const newPullClosedRecords = params.hasOwnProperty('pullClosedRecords') ? params.pullClosedRecords : prevPullClosedRecords;

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
            filterValue: [{ id: 0, name: filtersObj[key] }],
          });
        }
      }
      return filteredArray;
    };

    const prevFilterQuery = get(claims, 'advanceSearch.filterValues') || {};
    const newFilterQuery =
      params.hasOwnProperty('filterTerm') && params.filterTerm !== ''
        ? constructFilters(params.filterTerm)
        : constructFilters(prevFilterQuery?.filters);

    const postBody = {
      requestType: params?.requestType,
      page: (params && params.page) || 0,
      pageSize: (params && params.size) || claims.advanceTab.pageSize,
      search: newQuery,
      sortBy: newSortBy,
      searchBy: newSearchBy,
      direction: newDirection?.toUpperCase(),
      filterSearch: !isEmpty(newFilterQuery) ? newFilterQuery : null,
      filterLossClaimsCriteria: null,
      pullClosedRecords: newPullClosedRecords,
    };

    dispatch(getAdvanceSearchDetailsRequest(params));

    return utils.api
      .post({
        token: auth.accessToken,
        endpoint: endpoint.claimService,
        path: 'api/data/claims/search/advancedSearch',
        data: postBody,
      })
      .then((response) => utils.api.handleResponse(response))
      .then((data) => {
        dispatch(getAdvanceSearchDetailsSuccess(data, params?.requestType));
        return data;
      })
      .catch((err) => {
        if (params?.requestType === REQ_TYPES.search) {
          getAdvanceSearchDetailsTableFailure(err, defaultError);
        } else if (params?.requestType === REQ_TYPES.filter) {
          getAdvanceSearchDetailsFilterFailure(err, defaultError);
        }
        utils.api.handleUnauthorized(err, dispatch, authLogout);
        return err;
      });
  };

export const getAdvanceSearchDetailsRequest = (params) => {
  return {
    type: 'ADVANCE_SEARCH_DETAILS_REQUEST',
    payload: params,
  };
};

export const getAdvanceSearchDetailsSuccess = (data, requestType) => {
  let requestedItem;
  if (requestType === REQ_TYPES.search) {
    requestedItem = {
      items: data.data.searchValue,
      requestType: requestType,
      pagination: data.pagination,
    };
  }
  if (requestType === REQ_TYPES.filter) {
    requestedItem = {
      items: data.data.filterValue,
      requestType: requestType,
    };
  }
  return {
    type: 'ADVANCE_SEARCH_DETAILS_SUCCESS',
    payload: requestedItem,
  };
};

export const getAdvanceSearchDetailsTableFailure = (error) => {
  return {
    type: 'ADVANCE_SEARCH_DETAILS_TABLE_FAILURE',
    payload: error,
  };
};
export const getAdvanceSearchDetailsFilterFailure = (error) => {
  return {
    type: 'ADVANCE_SEARCH_DETAILS_FILTER_FAILURE',
    payload: error,
  };
};
