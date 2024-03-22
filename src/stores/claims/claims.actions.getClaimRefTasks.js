import get from 'lodash/get';
import moment from 'moment';

//app
import { authLogout, addLoader, removeLoader } from 'stores';
import * as utils from 'utils';
import { TASKS_SEARCH_OPTION_TASKI_REF, CLAIM_PROCESSING_REQ_TYPES } from 'consts';

export const getClaimRefTasks =
  (params = {}) =>
  (dispatch, getState) => {
    // prettier-ignore
    const { user: { auth }, config: { vars: { endpoint } }, claims } = getState();

    const defaultError = {
      file: 'stores/claims.actions.getClaimRefTasks',
    };

    const newRequestType = params?.requestType || CLAIM_PROCESSING_REQ_TYPES.search;

    const prevDirection = get(claims, 'refTabTasks.sort.direction') || '';
    const newDirection = params.hasOwnProperty('direction') ? params.direction : prevDirection;

    const newQuery = params.hasOwnProperty('search') ? params.search : '';

    const prevSortBy = get(claims, 'refTabTasks.sort.by') || '';
    const newSortBy = params.hasOwnProperty('sortBy') ? params.sortBy : prevSortBy;

    const claimID = get(claims, 'processing.selected[0].claimID') || '';

    const incomingFilterQuery = params.hasOwnProperty('filterTerm') && params.filterTerm !== '' ? params.filterTerm : [];
    const datesExceptionFields = ['createdOn', 'targetDueDate'];
    const constructFilter = Object.entries(incomingFilterQuery);
    const newFilterQuery = utils.generic.isValidArray(constructFilter, true)
      ? constructFilter
          .map((filter) => {
            const column = filter[0];
            const filterValue =
              column === 'priority'
              ? filter[1].map((item) => item)
                : datesExceptionFields.indexOf(column) > -1 && filter[1]
                ? [{ id: 1, name: moment(new Date(filter[1])).format('DD-MM-YYYY') }]
                : filter[1];
            return utils.generic.isValidArray(filterValue, true) && { column, filterValue };
          })
          .filter((item) => item)
      : null;

    const appliedParams = { newRequestType, newDirection, newQuery, newSortBy, newFilterQuery };
    const isNonFilterTypeCall = newRequestType !== CLAIM_PROCESSING_REQ_TYPES.filter;

    dispatch(getClaimRefTasksRequest({ params, appliedParams }));
    if (isNonFilterTypeCall) dispatch(addLoader('getClaimRefTasks'));

    const prevFilters = get(claims, 'refTabTasks.appliedFilters') || [];
    const newFilters = params.hasOwnProperty('filterTerm') ? newFilterQuery : prevFilters;

    return utils.api
      .post({
        token: auth.accessToken,
        endpoint: endpoint.claimService,
        path: `api/workflow/claims/task/claims/search/${claimID}`,
        data: {
          requestType: newRequestType,
          direction: newDirection,
          page: (params && params.page) || 0,
          pageSize: (params && params.size) || claims.refTabTasks.pageSize,
          search: newQuery,
          sortBy: newSortBy,
          filterSearch: newFilters,
          filterLossClaimsCriteriaDTO: null,
          searchBy: TASKS_SEARCH_OPTION_TASKI_REF,
        },
      })
      .then((response) => utils.api.handleResponse(response))
      .then((data) => utils.api.handleNewData(data))
      .then((json) => {
        dispatch(getClaimRefTasksSuccess(json, newRequestType, newSortBy, newDirection, newQuery, newFilterQuery));
        return json;
      })
      .catch((err) => {
        dispatch(getClaimRefTasksFailure(err, defaultError));
        utils.api.handleUnauthorized(err, dispatch, authLogout);
        return err;
      })
      .finally(() => {
        if (isNonFilterTypeCall) dispatch(removeLoader('getClaimRefTasks'));
      });
  };

export const getClaimRefTasksRequest = (params) => {
  return {
    type: 'CLAIMREF_TASKS_REQUEST',
    payload: params,
  };
};

export const getClaimRefTasksSuccess = (json, newRequestType, newSortBy, newDirection, newQuery, newFilterQuery) => {
  return {
    type: 'CLAIMREF_TASKS_SUCCESS',
    payload: {
      requestType: newRequestType,
      items: json.data,
      pagination: json?.pagination,
      sortBy: newSortBy,
      dir: newDirection,
      query: newQuery,
      appliedFilters: newFilterQuery,
    },
  };
};

export const getClaimRefTasksFailure = (error) => {
  return {
    type: 'CLAIMREF_TASKS_FAILURE',
    payload: error,
  };
};
