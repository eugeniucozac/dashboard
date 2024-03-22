import moment from 'moment';
import get from 'lodash/get';

// app
import * as utils from 'utils';
import { authLogout, addLoader, removeLoader } from 'stores';
import { CLAIM_TEAM_TYPE, CLAIM_PROCESSING_REQ_TYPES } from 'consts';

export const getClaimsProcessing =
  (params = {}) =>
  (dispatch, getState) => {
    // prettier-ignore
    const { user: { auth }, config: { vars: { endpoint } }, claims } = getState();

    const newRequestType = params?.requestType || CLAIM_PROCESSING_REQ_TYPES.search;

    const prevDirection = get(claims, 'processing.sort.direction') || '';
    const newDirection = params.hasOwnProperty('direction') ? params.direction : prevDirection;

    const prevQuery = get(claims, 'processing.query') || '';
    const newQuery = params.hasOwnProperty('term') ? params.term : prevQuery;

    const prevSortBy = get(claims, 'processing.sort.by') || '';
    const newSortBy = params.hasOwnProperty('sortBy')
      ? params.sortBy
      : prevSortBy && params.hasOwnProperty('firstTimeSort')
      ? params.firstTimeSort
      : prevSortBy;

    const prevSearchBy = get(claims, 'processing.searchBy') || '';
    const newSearchBy = params.hasOwnProperty('searchBy') ? params.searchBy : prevSearchBy;

    const datesExceptionFields = ['createdDate', 'dateAndTimeCreated'];

    const prevFilterQuery = get(claims, 'claimsProcessingData') || '';
    const newFilterQuery = params.hasOwnProperty('filterTerm') && params.filterTerm !== '' ? params.filterTerm : prevFilterQuery?.filters;

    const constructFilter = Object.entries(newFilterQuery);
    const updatedFilter = utils.generic.isValidArray(constructFilter, true)
      ? constructFilter
          .map((filter) => {
            const column = filter[0];
            const values = filter[1];
            const isPriorityFilter = column === 'priority';
            const isDateFilter = datesExceptionFields.includes(column) && values;

            let filterValue = values;
            if (isPriorityFilter) filterValue = values.map(({ id, name }) => ({ id, name: name }));
            if (isDateFilter) filterValue = [{ id: 1, name: moment(new Date(values)).format('DD-MM-YYYY') }];

            return utils.generic.isValidArray(filterValue, true) && { column, filterValue };
          })
          .filter((item) => item)
      : [];

    const appliedParams = { newRequestType, newDirection, newQuery, newSortBy, newSearchBy, updatedFilter };
    const isNonFilterTypeCall = newRequestType !== CLAIM_PROCESSING_REQ_TYPES.filter;

    dispatch(getClaimsProcessingRequest({ params, appliedParams }));
    if (isNonFilterTypeCall) dispatch(addLoader('getClaimsProcessing'));

    return utils.api
      .post({
        token: auth.accessToken,
        endpoint: endpoint.claimService,
        path: `api/workflow/claims/process/claims/search/${params?.claimsType}`,
        data: {
          requestType: newRequestType,
          direction: newDirection,
          filterLossClaimsCriteria: null,
          filterSearch: constructFilter.length ? updatedFilter : null,
          page: (params && params.page) || 0,
          pageSize: (params && params.size) || claims.processing.pageSize,
          search: newQuery,
          searchBy: newSearchBy,
          sortBy: newSortBy,
          ...(params?.claimsType !== CLAIM_TEAM_TYPE.allClaims && { pullClosedRecords: params?.pullClosedRecords }),
        },
      })
      .then((response) => utils.api.handleResponse(response))
      .then((json) => utils.api.handleNewData(json))
      .then((data) => {
        dispatch(getClaimsProcessingSuccess(data, newRequestType, newQuery));
        return data;
      })
      .catch((err) => {
        dispatch(getClaimsProcessingFailure(err, isNonFilterTypeCall));
        utils.api.handleUnauthorized(err, dispatch, authLogout);
        return err;
      })
      .finally(() => {
        if (isNonFilterTypeCall) dispatch(removeLoader('getClaimsProcessing'));
      });
  };

export const getClaimsProcessingRequest = (params) => {
  return {
    type: 'CLAIMS_PROCESSING_GET_REQUEST',
    payload: params,
  };
};

export const getClaimsProcessingSuccess = (data, newRequestType, newQuery) => {
  return {
    type: 'CLAIMS_PROCESSING_GET_SUCCESS',
    payload: {
      items: data.data,
      pagination: { ...data.pagination, search: newQuery },
      requestType: newRequestType,
    },
  };
};

export const getClaimsProcessingFailure = (error, isNonFilterTypeCall) => {
  return {
    type: 'CLAIMS_PROCESSING_GET_FAILURE',
    payload: { error, isNonFilterTypeCall },
  };
};
