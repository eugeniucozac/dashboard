import get from 'lodash/get';
import moment from 'moment';

//app
import { authLogout, addLoader, removeLoader } from 'stores';
import * as utils from 'utils';
import { CLAIM_PROCESSING_REQ_TYPES } from 'consts';

export const getClaimsTasksProcessing =
  (params = {}) =>
  (dispatch, getState) => {
    // prettier-ignore
    const { user: { auth }, config: { vars: { endpoint } }, claims } = getState();

    const defaultError = {
      file: 'stores/claims.actions.getClaimsTasksProcessing',
    };

    const newRequestType = params?.requestType || CLAIM_PROCESSING_REQ_TYPES.search;

    const prevDirection = get(claims, 'tasksProcessing.sort.direction') || '';
    const newDirection = params.hasOwnProperty('direction') ? params.direction : prevDirection;

    const prevSortBy = get(claims, 'tasksProcessing.sort.by') || '';
    const newSortBy = params.hasOwnProperty('sortBy') ? params.sortBy : prevSortBy;

    const prevQuery = get(claims, 'tasksProcessing.query') || '';
    const newQuery = params.hasOwnProperty('query') ? params.query : prevQuery;

    const prevSearchBy = get(claims, 'tasksProcessing.searchBy') || '';
    const newSearchBy = params.hasOwnProperty('searchType') ? params.searchType : prevSearchBy;

    const incomingFilterQuery = params.hasOwnProperty('filterTerm') && params.filterTerm !== '' ? params.filterTerm : [];
    const datesExceptionFields = ['createdOn', 'targetDueDate', 'inceptionDate'];
    const constructFilter = Object.entries(incomingFilterQuery);
    const newFilterQuery = utils.generic.isValidArray(constructFilter, true)
      ? constructFilter
          .map((filter) => {
            const column = filter[0];
            const filterValue =
              column === 'priority'
                ? filter[1].map(({ id, name }) => ({ id, name }))
                : datesExceptionFields.indexOf(column) > -1 && filter[1]
                ? [{ id: 1, name: moment(new Date(filter[1])).format('DD-MM-YYYY') }]
                : filter[1];
            return utils.generic.isValidArray(filterValue, true) && { column, filterValue };
          })
          .filter((item) => item)
      : null;

    const appliedParams = { newRequestType, newDirection, newQuery, newSortBy, newSearchBy, newFilterQuery };
    const isNonFilterTypeCall = newRequestType !== CLAIM_PROCESSING_REQ_TYPES.filter;

    dispatch(getClaimsTasksProcessingRequest({ params, appliedParams }));
    if (isNonFilterTypeCall) dispatch(addLoader('getClaimsTasksProcessing'));

    return utils.api
      .post({
        token: auth.accessToken,
        endpoint: endpoint.claimService,
        path: `api/workflow/claims/task/claims/search/${params.taskType}`,
        data: {
          requestType: newRequestType,
          direction: newDirection,
          page: (params && params.page) || 0,
          pageSize: (params && params.size) || claims.tasksProcessing.pageSize,
          sortBy: newSortBy,
          search: newQuery,
          searchBy: newSearchBy,
          filterSearch: newFilterQuery,
        },
      })
      .then((response) => utils.api.handleResponse(response))
      .then((data) => utils.api.handleNewData(data))
      .then((json) => {
        dispatch(
          getClaimsTasksProcessingSuccess(
            json,
            newRequestType,
            params.taskType,
            newSortBy,
            newDirection,
            newQuery,
            newFilterQuery,
            params.navigation
          )
        );
        return json;
      })
      .catch((err) => {
        dispatch(getClaimsTasksProcessingFailure(err, defaultError));
        utils.api.handleUnauthorized(err, dispatch, authLogout);
        return err;
      })
      .finally(() => {
        if (isNonFilterTypeCall) dispatch(removeLoader('getClaimsTasksProcessing'));
      });
  };

export const getClaimsTasksProcessingRequest = (params) => {
  return {
    type: 'CLAIMS_TASKS_PROCESSING_GET_REQUEST',
    payload: params,
  };
};

export const getClaimsTasksProcessingSuccess = (
  json,
  newRequestType,
  taskType,
  newSortBy,
  newDirection,
  newQuery,
  newFilterQuery,
  navigation
) => {
  return {
    type: 'CLAIMS_TASKS_PROCESSING_GET_SUCCESS',
    payload: {
      requestType: newRequestType,
      taskType,
      items: json.data,
      pagination: json.pagination,
      sortBy: newSortBy,
      dir: newDirection,
      query: newQuery,
      appliedFilters: newFilterQuery,
      navigation,
    },
  };
};

export const getClaimsTasksProcessingFailure = (error, defaultError, isNonFilterTypeCall) => {
  return {
    type: 'CLAIMS_TASKS_PROCESSING_GET_FAILURE',
    payload: { error, defaultError, isNonFilterTypeCall },
  };
};
