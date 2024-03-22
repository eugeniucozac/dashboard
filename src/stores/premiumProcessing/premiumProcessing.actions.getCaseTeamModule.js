import * as utils from 'utils';
import { authLogout } from 'stores';

export const getCaseTeamModule = (params) => (dispatch, getState) => {
  const {
    user: { auth },
    config: {
      vars: { endpoint },
    },
  } = getState();
  const taskId = params?.taskId;
  const caseId = params?.rfiCaseId;
  const rfiCase = params?.rfiType;
  const data = rfiCase ? caseId : taskId;
  const defaultError = {
    file: 'stores/premiumProcessing.actions.getCaseTeamModule',
  };

  dispatch(getCaseTeamModuleLoading(true));

  return utils.api
    .get({
      token: auth.accessToken,
      endpoint: endpoint.bpmService,
      path: 'workflow/process/caseTeam/' + data,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleNewData(json))
    .then((data) => {
      if (data?.data) {
        dispatch(getCaseTeamSuccess(data.data));
      }
      return data.data;
    })
    .catch((error) => {
      utils.api.handleError(error, { ...defaultError, message: 'API fetch error (getCaseTeam)' });
      dispatch(getCaseTeamError(true));
      utils.api.handleUnauthorized(error, dispatch, authLogout);
      return error?.json;
    })
    .finally(() => {
      dispatch(getCaseTeamModuleLoading(false));
    });
};

export const getCaseTeamSuccess = (data) => {
  return {
    type: 'PREMIUM_PROCESSING_CASE_TEAM_GET_SUCCESS',
    payload: data,
  };
};

export const getCaseTeamError = (error) => {
  return {
    type: 'PREMIUM_PROCESSING_CASE_TEAM_GET_ERROR',
    payload: error,
  };
};

export const getCaseTeamModuleLoading = (loading) => {
  return {
    type: 'PREMIUM_PROCESSING_CASE_TEAM_MODULE_GET_LOADING',
    payload: loading,
  };
};
