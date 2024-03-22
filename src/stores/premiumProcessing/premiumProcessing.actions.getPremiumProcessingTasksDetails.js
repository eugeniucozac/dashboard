import { authLogout } from 'stores';
import * as utils from 'utils';
import get from 'lodash/get';
import moment from 'moment';

export const getPremiumProcessingTasksDetails =
  (params = {}) =>
  (dispatch, getState) => {
    const {
      user: { auth },
      config: {
        vars: { endpoint },
      },
      premiumProcessing,
    } = getState();

    const defaultError = {
      file: 'stores/premiumProcessing.actions.getPremiumProcessingTasksDetails',
    };

    const newRequestType = params?.requestType || 'search';

    const prevDirection = get(premiumProcessing, 'casesList.sort.direction') || '';
    const newDirection = params.hasOwnProperty('direction') ? params.direction : prevDirection;

    const prevQuery = get(premiumProcessing, 'casesList.query') || '';
    const newQuery = params.hasOwnProperty('query') ? params.query : prevQuery;

    const prevSortBy = get(premiumProcessing, 'casesList.sort.by') || '';
    const newSortBy = params.hasOwnProperty('sortBy') ? params.sortBy : prevSortBy;

    const prevSearchBy = get(premiumProcessing, 'casesList.searchBy') || '';
    const newSearchBy = params.hasOwnProperty('searchType') ? params.searchType : prevSearchBy;

    const prevIsCheckSigning = get(premiumProcessing, 'casesList.isCheckSigning') || false;
    const newIsCheckSigning = params.hasOwnProperty('isCheckSigning') ? params.isCheckSigning : prevIsCheckSigning;

    const newFilterQuery =
      params.hasOwnProperty('filterTerm') && params.filterTerm !== ''
        ? params.filterTerm
        : get(premiumProcessing, 'casesList.appliedFilters') || [];
    const datesExceptionFields = ['caseCreatedOn', 'targetDueDate', 'inceptionDate'];
    const constructFilter = Object.entries(newFilterQuery);
    let updatedFilter = null;
    if (params.hasOwnProperty('filterTerm') && params.filterTerm !== '') {
      updatedFilter = utils.generic.isValidArray(constructFilter, true)
        ? constructFilter
            .map((filter) => {
              const column = filter[0];
              const filterValue =
                datesExceptionFields.indexOf(column) > -1 && filter[1]
                  ? [{ id: 1, name: moment(new Date(filter[1])).format('DD-MM-YYYY') }]
                  : filter[1];
              return utils.generic.isValidArray(filterValue, true) && { column, filterValue };
            })
            .filter((item) => item)
        : null;
    } else {
      updatedFilter =
        !(params.hasOwnProperty('filterTerm') && params.filterTerm !== '') && get(premiumProcessing, 'casesList.appliedFilters');
    }
    const appliedParams = { newRequestType, newDirection, newQuery, newSortBy, newSearchBy, updatedFilter };
    const isNonFilterTypeCall = newRequestType !== 'filter';

    dispatch(getPremiumProcessingTasksDetailsRequest({ params, appliedParams }));
    if (isNonFilterTypeCall) {
      dispatch(setTaskGridLoading(true));
    }
    return utils.api
      .post({
        token: auth.accessToken,
        endpoint: endpoint.bpmService,
        path: `workflow/process/taskSummaryV1/${params.taskType}`,
        data: {
          requestType: newRequestType,
          direction: newDirection,
          page: (params && params.page) || 0,
          pageSize: (params && params.size) || premiumProcessing.casesList.pageSize,
          sortBy: newSortBy,
          searchBy: newSearchBy,
          search: newQuery,
          filterSearch: updatedFilter,
          isCheckSigning: newIsCheckSigning,
          refType: params.refType ? params.refType : null,
        },
      })
      .then((response) => utils.api.handleResponse(response))
      .then((data) => utils.api.handleNewData(data))
      .then((json) => {
        dispatch(
          getPremiumProcessingTasksDetailsSuccess(
            json,
            newRequestType,
            params.taskType,
            newSortBy,
            newDirection,
            newQuery,
            newSearchBy,
            updatedFilter,
            params.navigation,
            newIsCheckSigning
          )
        );
        return json;
      })
      .catch((err) => {
        dispatch(getPremiumProcessingTasksDetailsFailure(err, defaultError, params?.requestType));
        utils.api.handleUnauthorized(err, dispatch, authLogout);
        return err;
      })
      .finally(() => {
        if (isNonFilterTypeCall) {
          dispatch(setTaskGridLoading(false));
        }
      });
  };

export const getPremiumProcessingTasksDetailsRequest = (params) => {
  return {
    type: 'PREMIUM_PROCESSING_TASKS_GET_REQUEST',
    payload: params,
  };
};

export const setTaskGridLoading = (flag) => {
  return {
    type: 'PREMIUM_PORCESSING_SET_TASK_GRID_LOADING',
    payload: {
      flag: flag,
    },
  };
};

export const getPremiumProcessingTasksDetailsSuccess = (
  json,
  newRequestType,
  taskType,
  newSortBy,
  newDirection,
  newQuery,
  newSearchBy,
  updatedFilter,
  navigation,
  newIsCheckSigning
) => {
  return {
    type: 'PREMIUM_PROCESSING_TASKS_GET_SUCCESS',
    payload: {
      requestType: newRequestType,
      taskType,
      items: json.data,
      pagination: json.pagination,
      sortBy: newSortBy,
      dir: newDirection,
      query: newQuery,
      searchBy: newSearchBy,
      appliedFilters: updatedFilter,
      navigation,
      isCheckSigning: newIsCheckSigning,
    },
  };
};

export const getPremiumProcessingTasksDetailsFailure = (error, defaultError, type) => {
  return {
    type: 'PREMIUM_PROCESSING_TASKS_GET_FAILURE',
    payload: { error, defaultError, type },
  };
};
