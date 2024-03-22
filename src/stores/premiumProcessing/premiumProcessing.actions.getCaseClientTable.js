import { authLogout, addLoader, removeLoader } from 'stores';
import * as utils from 'utils';

export const getCaseClientTable = (params) => (dispatch, getState) => {
  const {
    user: { auth },
    config: {
      vars: { endpoint },
    },
  } = getState();

  const { caseIncidentID, policyId = '', sourceId = '' } = params;

  const request = { caseIncidentID, issueDocsType: 'Clients', policyID: policyId, sourceID: sourceId };

  dispatch(getCaseClientTableRequest(request));
  dispatch(addLoader('getCaseClientTable'));
  return utils.api
    .get({
      token: auth.accessToken,
      endpoint: endpoint.bpmService,
      path: 'issueDocs/getIssueDocsDetails',
      params: request,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleNewData(json))
    .then((data) => {
      dispatch(getCaseClientTableSuccess(data));
      return data;
    })
    .catch((err) => {
      dispatch(getCaseClientTableFailure(err));
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      return err;
    })
    .finally(() => {
      dispatch(removeLoader('getCaseClientTable'));
    });
};

export const getCaseClientTableRequest = (params) => {
  return {
    type: 'PREMIUM_PROCESSING_CASE_CLIENT_LIST_GET_REQUEST',
    payload: params,
  };
};

export const getCaseClientTableSuccess = (data) => {
  return {
    type: 'PREMIUM_PROCESSING_CASE_CLIENT_LIST_GET_SUCCESS',
    payload: {
      items: data.data,
    },
  };
};

export const getCaseClientTableFailure = (error) => {
  return {
    type: 'PREMIUM_PROCESSING_CASE_CLIENT_LIST_GET_FAILURE',
    payload: error,
  };
};
