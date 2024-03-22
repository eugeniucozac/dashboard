import * as utils from 'utils';
import isEmpty from 'lodash/isEmpty';
import { authLogout, enqueueNotification } from 'stores';

export const getCaseRFIDetails = (params) => (dispatch, getState) => {
  const {
    user: { auth },
    config: {
      vars: { endpoint },
    },
  } = getState();

  if (!params?.taskId) {
    return;
  }
  const defaultError = {
    file: 'stores/premiumProcessing.actions.getCaseRFIDetails',
  };
  dispatch(getCaseRFIDetailsRequest(params));
  dispatch(getCaseRFILoading(true));

  return utils.api
    .get({
      token: auth.accessToken,
      endpoint: endpoint.bpmService,
      path: 'workflow/rfi/details',
      params: params,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((data) => {
      // check that response is valid
      // sometimes API fails and return an empty array instead of object
      if (data?.data?.taskId) {
        dispatch(getCaseRFIDetailsSuccess(data.data));
        return data.data;
      } else {
        if (!isEmpty(data?.data)) {
          return Promise.reject({ message: 'Invalid rfi object returned by API' });
        }
      }
    })
    .catch((error) => {
      utils.api.handleError(error, { ...defaultError, message: 'API fetch error (getCaseRFIDetails)' });
      dispatch(getCaseRFIDetailsError(error));
      dispatch(enqueueNotification('notification.rfi.fieldsNotPopulateErrorMessage', 'error'));
      utils.api.handleUnauthorized(error, dispatch, authLogout);
    })
    .finally(() => {
      dispatch(getCaseRFILoading(false));
    });
};
export const getCaseRFIDetailsRequest = (data) => {
  return {
    type: 'PREMIUM_PROCESSING_CASE_RFI_DETAILS_REQUEST',
    payload: data,
  };
};
export const getCaseRFIDetailsSuccess = (data) => {
  return {
    type: 'PREMIUM_PROCESSING_CASE_RFI_DETAILS_SUCCESS',
    payload: data,
  };
};

export const getCaseRFIDetailsError = (error) => {
  return {
    type: 'PREMIUM_PROCESSING_CASE_RFI_DETAILS_ERROR',
    payload: error,
  };
};
export const getCaseRFILoading = (loading) => {
  return {
    type: 'PREMIUM_PROCESSING_CASE_TEAM_GET_LOADING',
    payload: loading,
  };
};
