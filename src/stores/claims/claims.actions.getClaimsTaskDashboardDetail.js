//app
import { authLogout, addLoader, removeLoader } from 'stores';
import * as utils from 'utils';
import { CLAIM_PROCESSING_REQ_TYPES, TASK_TEAM_TYPE } from 'consts';

export const getClaimsTaskDashboardDetail =
  (params = {}) =>
  (dispatch, getState) => {
    // prettier-ignore
    const { user: { auth }, config: { vars: { endpoint } }, claims } = getState();

    const defaultError = {
      file: 'stores/claims.actions.getClaimsTaskDashboardDetail',
    };

    const newRequestType = CLAIM_PROCESSING_REQ_TYPES.search;
    const newQuery = params?.query;
    const taskType = claims.tasksTab.taskType || TASK_TEAM_TYPE.myTask;
    const viewLoader = params?.viewLoader ?? true;
    const isRfiTask = params?.isRfiTask || false;

    dispatch(getClaimsTaskDashboardDetailRequest(params));
    viewLoader && dispatch(addLoader('getClaimsTaskDashboardDetail'));

    if (!newQuery) {
      dispatch(getClaimsTaskDashboardDetailFailure({ ...defaultError, message: 'Missing query param' }));
      dispatch(removeLoader('getClaimsTaskDashboardDetail'));
      return;
    }

    return utils.api
      .post({
        token: auth.accessToken,
        endpoint: endpoint.claimService,
        path: `api/workflow/claims/task/claims/search/${taskType}`,
        data: {
          requestType: newRequestType,
          direction: 'asc',
          page: 0,
          pageSize: claims.tasksTab.pageSize,
          sortBy: claims.tasksTab.sort.by,
          search: newQuery,
          searchBy: claims.tasksTab.searchBy,
          filterSearch: [],
        },
      })
      .then((response) => utils.api.handleResponse(response))
      .then((data) => utils.api.handleNewData(data))
      .then((json) => {
        dispatch(getClaimsTaskDashboardDetailSuccess(json, params.taskType, newQuery, isRfiTask));
        return json;
      })
      .catch((err) => {
        dispatch(getClaimsTaskDashboardDetailFailure(err, defaultError, isRfiTask));
        utils.api.handleUnauthorized(err, dispatch, authLogout);
        return err;
      })
      .finally(() => {
        viewLoader && dispatch(removeLoader('getClaimsTaskDashboardDetail'));
      });
  };

export const getClaimsTaskDashboardDetailRequest = (params) => {
  return {
    type: 'CLAIMS_TASK_DASHBOARD_DETAIL_GET_REQUEST',
    payload: params,
  };
};

export const getClaimsTaskDashboardDetailSuccess = (json, taskType, newQuery, isRfiTask) => {
  return {
    type: 'CLAIMS_TASK_DASHBOARD_DETAIL_GET_SUCCESS',
    payload: {
      taskType,
      items: json.data.searchValue,
      query: newQuery,
      isRfiTask,
    },
  };
};

export const getClaimsTaskDashboardDetailFailure = (error, defaultError, isRfiTask) => {
  return {
    type: 'CLAIMS_TASK_DASHBOARD_DETAIL_GET_FAILURE',
    payload: { error, defaultError, isRfiTask },
  };
};
