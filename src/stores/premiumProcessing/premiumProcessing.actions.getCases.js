import { authLogout, addLoader, removeLoader } from 'stores';
import * as utils from 'utils';
import get from 'lodash/get';

export const getCasesList =
  (params = {}) =>
  (dispatch, getState) => {
    // prettier-ignore
    const { user: { auth }, config: { vars: { endpoint }}, premiumProcessing} = getState();

    const defaultError = {
      file: 'stores/premiumProcessing.actions.getCases',
    };

    const type = params.hasOwnProperty('type') ? params.type : get(premiumProcessing, 'casesList.type');
    const prevDirection = get(premiumProcessing, 'casesList.sort.direction') || '';
    const newDirection = params.hasOwnProperty('direction') ? params.direction : prevDirection;

    const prevSortBy = get(premiumProcessing, 'casesList.sort.by') || '';
    const newSortBy = params.hasOwnProperty('orderBy') ? params.orderBy : prevSortBy;

    const prevFilters = get(premiumProcessing, 'casesList.filters');
    const filtersObject = params.hasOwnProperty('filters') ? params.filters : prevFilters;
    const request = {
      page: (params && params.page) || 1,
      pageSize: (params && params.size) || premiumProcessing.casesList.pageSize,
      sortBy: newSortBy,
      taskView: type,
      direction: newDirection,
      filters: filtersObject || {},
      checkSigning: params.checkSigning || false,
    };
    dispatch(getCasesListRequest(request));
    dispatch(addLoader('getCasesList'));
    return utils.api
      .post({
        token: auth.accessToken,
        endpoint: endpoint.bpmService,
        path: 'workflow/process/taskSummary/',
        data: request,
      })
      .then((response) => utils.api.handleResponse(response))
      .then((json) => utils.api.handleNewData(json))
      .then((data) => {
        if (data?.data.length > 0) {
          data?.data.forEach((element) => {
            element.id = `${element.taskId}_${element.caseId}_${element.bpmProcessId}`;
            element.assignedToUser['id'] = element.assignedToUser.emailId;
          });
        }
        dispatch(getCasesListSuccess(data));
        return data;
      })
      .catch((err) => {
        utils.api.handleError(err, { ...defaultError, message: 'API fetch error (premiumProcessing.post)' });
        dispatch(getCasesListFailure(err));
        utils.api.handleUnauthorized(err, dispatch, authLogout);
        return err;
      })
      .finally(() => {
        dispatch(removeLoader('getCasesList'));
      });
  };

export const getCasesListRequest = (params) => {
  return {
    type: 'PREMIUM_PROCESSING_CASES_LIST_GET_REQUEST',
    payload: params,
  };
};

export const getCasesListSuccess = (data) => {
  return {
    type: 'PREMIUM_PROCESSING_CASES_LIST_GET_SUCCESS',
    payload: {
      items: data.data,
      pagination: data.pagination,
      type: data.type,
      fitlers: data.filters,
    },
  };
};

export const getCasesListFailure = (error) => {
  return {
    type: 'PREMIUM_PROCESSING_CASES_LIST_GET_FAILURE',
    payload: error,
  };
};
