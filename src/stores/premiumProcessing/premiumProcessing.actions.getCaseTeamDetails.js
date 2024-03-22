import * as utils from 'utils';
import { authLogout, enqueueNotification } from 'stores';

export const getCaseTeamDetails = (params) => (dispatch, getState) => {
  const {
    user: { auth },
    config: {
      vars: { endpoint },
    },
  } = getState();

  const queryParam = {
    bpmTaskID: params?.taskId,
    taskView: params.taskView,
  };
  const defaultError = {
    file: 'stores/premiumProcessing.actions.getCaseTeamDetails',
  };

  dispatch(getCaseTeamDetailsRequest(params));
  dispatch(getCaseTeamLoading(true));

  return utils.api
    .get({
      token: auth.accessToken,
      endpoint: endpoint.bpmService,
      path: 'workflow/task/details',
      params: queryParam,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleNewData(json))
    .then((data) => {
      // check that response is valid
      // sometimes API fails and return an empty array instead of object
      if (data?.data?.bpmTaskId) {
        return data;
      } else {
        return Promise.reject({ message: 'Invalid task object returned by API' });
      }
    })
    .catch((error) => {
      utils.api.handleError(error, { ...defaultError, message: 'API fetch error (getCaseTeamDetails)' });
      utils.api.handleUnauthorized(error, dispatch, authLogout);
      dispatch(getCaseTeamDetailsFailure(error));
      dispatch(enqueueNotification('premiumProcessing.caseDetailsResponseError', 'error'));
      return error;
    })
    .finally(() => {
      dispatch(getCaseTeamLoading(false));
    });
};

export const getCaseTeamDetailsRequest = (params) => {
  return {
    type: 'CASE_TEAM_DETAILS_REQUEST',
    payload: params,
  };
};

export const getCaseTeamDetailsSuccess = (caseTeamList, caseId) => {
  return {
    type: 'CASE_TEAM_DETAILS_SUCCESS',
    payload: caseTeamList,
  };
};

export const getCaseTeamDetailsFailure = (error) => {
  return {
    type: 'CASE_TEAM_DETAILS_FAILURE',
    payload: error,
  };
};
export const getCaseTeamLoading = (loading) => {
  return {
    type: 'PREMIUM_PROCESSING_CASE_TEAM_GET_LOADING',
    payload: loading,
  };
};
