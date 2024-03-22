import { removeLoader, addLoader, enqueueNotification, authLogout } from 'stores';
import * as utils from 'utils';

export const getTaskCaseViewType = (params) => (dispatch, getState) => {
  const {
    user: { auth },
    config: {
      vars: { endpoint },
    },
  } = getState();

  const defaultError = {
    file: 'stores/premiumProcessing.actions.getTaskCaseViewType',
  };
  dispatch(getTaskCaseViewTypeRequest(params));
  dispatch(addLoader('getTaskCaseViewType'));

  if (!params?.caseId) {
    dispatch(getTaskCaseViewTypeFailure({ ...defaultError, message: 'Missing parameters' }));
    dispatch(enqueueNotification('premiumProcessing.invalidRequest', 'error'));
    dispatch(removeLoader('getTaskCaseViewType'));
    return;
  }

  return utils.api
    .get({
      token: auth.accessToken,
      endpoint: endpoint.bpmService,
      path: `workflow/process/notification/landing/page/${params?.caseId}`,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleNewData(json))
    .then((data) => {
      dispatch(getTaskCaseViewTypeSuccess(data?.data));
      return data;
    })
    .catch((error) => {
      utils.api.handleError(error, { ...defaultError, message: 'API fetch error (premiumProcessing.getTaskCaseViewType)' });
      utils.api.handleUnauthorized(error, dispatch, authLogout);
      dispatch(getTaskCaseViewTypeFailure(error, defaultError, 'filter'));
      dispatch(getTaskCaseViewTypeFailure(error, defaultError, 'search'));
      dispatch(enqueueNotification('premiumProcessing.apiResponseError', 'error'));
      return error;
    })
    .finally(() => {
      dispatch(removeLoader('getTaskCaseViewType'));
    });
};

export const getTaskCaseViewTypeRequest = (payload) => {
  return {
    type: 'PREMIUM_PROCESSING_TASK_CASE_VIEW_TYPE_REQUEST',
    payload,
  };
};

export const getTaskCaseViewTypeSuccess = (data) => {
  return {
    type: 'PREMIUM_PROCESSING_TASK_CASE_VIEW_TYPE_SUCCESS',
    payload: data,
  };
};

export const getTaskCaseViewTypeFailure = (error, defaultError, type) => {
  return {
    type: 'PREMIUM_PROCESSING_TASK_CASE_VIEW_TYPE_FAILURE',
    payload: { error, defaultError, type },
  };
};
