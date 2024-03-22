import { authLogout } from 'stores';
import * as utils from 'utils';

export const getCheckSigningCaseHistory =
  ({ processIdData } = {}) =>
  (dispatch, getState) => {
    const {
      user: { auth },
      config: {
        vars: { endpoint },
      },
    } = getState();

    const defaultError = {
      file: 'stores/premiumProcessing.actions.getCheckSigningCaseHistory',
    };
    const processId = processIdData;
    dispatch(getCheckSigningCaseHistoryRequest());
    dispatch(getCheckSigningCaseHistoryLoading(true));

    return utils.api
      .get({
        token: auth.accessToken,
        endpoint: endpoint.bpmService,
        path: `checksigning/task/history/${processId}`,
      })
      .then((response) => utils.api.handleResponse(response))
      .then((data) => utils.api.handleNewData(data))
      .then((json) => {
        dispatch(getCheckSigningCaseHistorySuccess(json));
        return json;
      })
      .catch((error) => {
        dispatch(getCheckSigningCaseHistoryFailure(error, defaultError));
        utils.api.handleUnauthorized(error, dispatch, authLogout);
        return error;
      })
      .finally(() => {
        dispatch(getCheckSigningCaseHistoryLoading(false));
      });
  };

export const getCheckSigningCaseHistoryRequest = () => {
  return {
    type: 'PREMIUM_PROCESSING_CHECK_SIGNING_CASE_HISTORY_REQUEST',
  };
};

export const getCheckSigningCaseHistorySuccess = (data) => {
  return {
    type: 'PREMIUM_PROCESSING_CHECK_SIGNING_CASE_HISTORY_SUCCESS',
    data,
  };
};

export const getCheckSigningCaseHistoryFailure = (error, defaultError) => {
  return {
    type: 'PREMIUM_PROCESSING_CHECK_SIGNING_CASE_HISTORY_FAILURE',
    error: {
      ...error,
      ...defaultError,
    },
  };
};

export const getCheckSigningCaseHistoryLoading = (loading) => {
  return {
    type: 'PREMIUM_PROCESSING_CHECK_SIGNING_CASE_HISTORY_LOADING',
    payload: loading,
  };
};