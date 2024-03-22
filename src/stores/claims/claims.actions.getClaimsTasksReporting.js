import { authLogout } from 'stores';
import * as utils from 'utils';

export const getClaimsTasksReporting = (processType) => (dispatch, getState) => {
  // prettier-ignore

  const { user: { auth }, config: { vars: { endpoint } } } = getState();

  const defaultError = {
    file: 'stores/claims.actions.getClaimsTasksReporting',
  };

  dispatch(getClaimsTasksReportingRequest(processType));

  return utils.api
    .get({
      token: auth.accessToken,
      endpoint: endpoint.bpmService,
      path: `workflow/process/getClaimsTasksStats?processType=${processType}`,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleNewData(json))
    .then((data) => {
      dispatch(getClaimsTasksReportingSuccess(data.data));
      return data;
    })
    .catch((err) => {
      utils.api.handleError(err, defaultError);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(getClaimsTasksReportingFailure(err));
      return err;
    });
};

export const getClaimsTasksReportingRequest = (params) => {
  return {
    type: 'TASKS_CLAIMS_REPORTING_GET_REQUEST',
    payload: params,
  };
};

export const getClaimsTasksReportingSuccess = (data) => {
  return {
    type: 'TASKS_CLAIMS_REPORTING_GET_SUCCESS',
    payload: data,
  };
};

export const getClaimsTasksReportingFailure = (error) => {
  return {
    type: 'TASKS_CLAIMS_REPORTING_GET_FAILURE',
    payload: error,
  };
};
