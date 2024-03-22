import * as utils from 'utils';
import { authLogout } from 'stores';

export const getCaseHistoryDetails = (params) => (dispatch, getState) => {
  const {
    user: { auth },
    config: {
      vars: { endpoint },
    },
  } = getState();

  dispatch(getCaseHistoryDetailsRequest());
  dispatch(getCaseHistoryDetailsLoading(true));

  const queryParam = {
    taskId: params?.taskId || '',
    bpmProcessId: params?.processId,
  };

  return utils.api
    .get({
      token: auth.accessToken,
      endpoint: endpoint.bpmService,
      path: `workflow/task/history`,
      params: queryParam,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleNewData(json))
    .then((data) => {
      if (data && data?.status === utils.string.t('app.ok') && data?.data) {
        dispatch(getCaseHistoryDetailsSuccess(data?.data));
      }
      return data?.data;
    })
    .catch((err) => {
      const errorParams = {
        file: 'stores/premiumProcessing.actions.getCaseHistoryDetails',
        message: 'API fetch error (premiumProcessing.actions.getCaseHistoryDetails)',
      };
      utils.api.handleError(err, errorParams);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(getCaseHistoryDetailsFailure(true));
      return err;
    })
    .finally(() => {
      dispatch(getCaseHistoryDetailsLoading(false));
    });
};

export const getCaseHistoryDetailsRequest = () => {
  return {
    type: 'PREMIUM_PROCESSING_CASE_HISTORY_DETAILS_REQUEST',
  };
};

export const getCaseHistoryDetailsSuccess = (data) => {
  return {
    type: 'PREMIUM_PROCESSING_CASE_HISTORY_DETAILS_SUCCESS',
    payload: data,
  };
};

export const getCaseHistoryDetailsFailure = (error) => {
  return {
    type: 'PREMIUM_PROCESSING_CASE_HISTORY_DETAILS_FAILURE',
    payload: error,
  };
};

export const getCaseHistoryDetailsLoading = (loading) => {
  return {
    type: 'PREMIUM_PROCESSING_CASE_HISTORY_DETAILS_GET_LOADING',
    payload: loading,
  };
};
