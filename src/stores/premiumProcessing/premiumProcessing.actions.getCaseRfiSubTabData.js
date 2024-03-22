import * as utils from 'utils';
import { authLogout } from 'stores';

export const getCaseRfiSubTabData = (caseIdData) => (dispatch, getState) => {
  const {
    user: { auth },
    config: {
      vars: { endpoint },
    },
  } = getState();

  const defaultError = {
    file: 'stores/premiumProcessing.actions.getCaseRfiSubTabData',
  };

  dispatch(getCaseRfiSubTabDataLoading(true));

  return utils.api
    .get({
      token: auth.accessToken,
      endpoint: endpoint.bpmService,
      path: 'workflow/rfi/summary',
      params: { caseId: caseIdData },
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleNewData(json))
    .then((data) => {
      if (data?.data) {
        dispatch(getCaseRfiSubTabDataSuccess(data.data));
      }
      return data.data;
    })
    .catch((error) => {
      utils.api.handleError(error, { ...defaultError, message: 'API fetch error (getCaseRfiSubTabData)' });
      dispatch(getCaseRfiSubTabDataError(error));
      utils.api.handleUnauthorized(error, dispatch, authLogout);
      return error?.json;
    })
    .finally(() => {
      dispatch(getCaseRfiSubTabDataLoading(false));
    });
};

export const getCaseRfiSubTabDataSuccess = (data) => {
  return {
    type: 'PREMIUM_PROCESSING_CASE_RFI_GET_SUBTABS_SUCCESS',
    payload: data,
  };
};

export const getCaseRfiSubTabDataError = (error) => {
  return {
    type: 'PREMIUM_PROCESSING_CASE_RFI_GET_SUBTABS_ERROR',
    payload: error,
  };
};

export const getCaseRfiSubTabDataLoading = (loading) => {
  return {
    type: 'PREMIUM_PROCESSING_CASE_RFI_GET_SUBTABS_LOADING',
    payload: loading,
  };
};
