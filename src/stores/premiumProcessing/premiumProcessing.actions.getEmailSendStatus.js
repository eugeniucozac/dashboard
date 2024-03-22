import { authLogout, addLoader, removeLoader } from 'stores';
import * as utils from 'utils';

export const getEmailSendStatus = (params) => (dispatch, getState) => {
  const {
    user: { auth },
    config: {
      vars: { endpoint },
    },
  } = getState();

  const { caseId, policyId = '', sourceId = '' } = params;

  const request = { caseIncidentID: caseId, policyID: policyId, sourceID: sourceId };

  dispatch(getEmailSendStatusRequest(request));
  dispatch(addLoader('getEmailSendStatus'));
  return utils.api
    .get({
      token: auth.accessToken,
      endpoint: endpoint.bpmService,
      path: 'issueDocs/getEmailSendStatus',
      params: request,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleNewData(json))
    .then((data) => {
      dispatch(getEmailSendStatusSuccess(data));
      return data;
    })
    .catch((err) => {
      dispatch(getEmailSendStatusFailure(err));
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      return err;
    })
    .finally(() => {
      dispatch(removeLoader('getEmailSendStatus'));
    });
};

export const getEmailSendStatusRequest = (params) => {
  return {
    type: 'PREMIUM_PROCESSING_EMAIL_SENT_STATUS_GET_REQUEST',
    payload: params,
  };
};

export const getEmailSendStatusSuccess = (data) => {
  return {
    type: 'PREMIUM_PROCESSING_EMAIL_SENT_STATUS_GET_SUCCESS',
    payload: {
      items: data.data,
    },
  };
};

export const getEmailSendStatusFailure = (error) => {
  return {
    type: 'PREMIUM_PROCESSING_EMAIL_SENT_STATUS_GET_FAILURE',
    payload: error,
  };
};
