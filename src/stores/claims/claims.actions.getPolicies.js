import { authLogout, addLoader, removeLoader } from 'stores';
import * as utils from 'utils';
import get from 'lodash/get';
import moment from 'moment';
import { CLAIM_POLICY_SEARCH_REQ_TYPES } from 'consts';

export const getPolicies = (params) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint } }, claims } = getState();

  const newRequestType = params?.requestType || CLAIM_POLICY_SEARCH_REQ_TYPES.search;

  const prevDirection = get(claims, 'policies.sort.direction') || '';
  const newDirection = params.hasOwnProperty('direction') ? params.direction : prevDirection;

  const prevQuery = get(claims, 'policies.query') || '';
  const newQuery = params.hasOwnProperty('term') ? params.term : prevQuery;

  const prevSortBy = get(claims, 'policies.sort.by') || '';
  const newSortBy = params.hasOwnProperty('sortBy') ? params.sortBy : prevSortBy;

  const prevSearchBy = get(claims, 'policies.searchBy') || '';
  const newSearchBy = params.hasOwnProperty('searchBy') ? params.searchBy : prevSearchBy;

  const newFilterQuery = params.hasOwnProperty('filterTerm') && params.filterTerm !== '' ? params.filterTerm : [];
  const datesExceptionFields = ['inceptionDate', 'expiryDate'];
  const constructFilter = Object.entries(newFilterQuery);
  const updatedFilter = utils.generic.isValidArray(constructFilter, true)
    ? constructFilter
        .map((filter) => {
          const column = filter[0];
          const filterValue =
            datesExceptionFields.indexOf(column) > -1 && filter[1]
              ? [{ id: 1, name: moment(new Date(filter[1])).format('YYYY-MM-DD') }]
              : filter[1];
          return utils.generic.isValidArray(filterValue, true) && { column, filterValue };
        })
        .filter((item) => item)
    : [];

  const appliedParams = { newRequestType, newDirection, newQuery, newSortBy, newSearchBy, updatedFilter };
  const isNonFilterTypeCall = newRequestType !== CLAIM_POLICY_SEARCH_REQ_TYPES.filter;
  const viewLoader = params?.viewLoader ?? false;
  const data = {
    requestType: newRequestType,
    filterLossClaimsCriteria: null,
    page: (params && params.page) || 0,
    pageSize: (params && params.size) || claims.policies.pageSize,
    search: newQuery,
    sortBy: newSortBy,
    searchBy: newSearchBy,
    direction: newDirection,
    filterSearch: updatedFilter,
  };

  dispatch(getPoliciesRequest({ params, appliedParams }));
  if (isNonFilterTypeCall && viewLoader) dispatch(addLoader('getPolicies'));

  return utils.api
    .post({
      token: auth.accessToken,
      endpoint: endpoint.claimService,
      path: 'api/data/policy/claims/search',
      data,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleNewData(json))
    .then((data) => {
      dispatch(getPoliciesSuccess(data, newRequestType));
      return data;
    })
    .catch((err) => {
      dispatch(getPoliciesFailure(err, isNonFilterTypeCall));
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      return err;
    })
    .finally(() => {
      if (isNonFilterTypeCall && viewLoader) dispatch(removeLoader('getPolicies'));
    });
};

export const getPoliciesRequest = (params) => {
  return {
    type: 'CLAIMS_POLICIES_GET_REQUEST',
    payload: params,
  };
};

export const getPoliciesSuccess = (data, newRequestType) => {
  return {
    type: 'CLAIMS_POLICIES_GET_SUCCESS',
    payload: {
      items: data.data,
      pagination: data.pagination,
      requestType: newRequestType,
    },
  };
};

export const getPoliciesFailure = (error, isNonFilterTypeCall) => {
  return {
    type: 'CLAIMS_POLICIES_GET_FAILURE',
    payload: { error, isNonFilterTypeCall },
  };
};
