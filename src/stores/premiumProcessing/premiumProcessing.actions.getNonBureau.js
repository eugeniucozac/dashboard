import { authLogout, addLoader, removeLoader } from 'stores';
import * as utils from 'utils';

export const getNonBureauList = (params) => (dispatch, getState) => {
  const {
    user: { auth },
    config: {
      vars: { endpoint },
    },
  } = getState();

  const { caseIncidentID, policyId = '', xbInstanceId = '' } = params;

  const request = { caseIncidentID, issueDocsType: 'NonBureau', policyID: policyId, sourceID: xbInstanceId };

  dispatch(getNonBureauListRequest(request));
  dispatch(addLoader('getNonBureauList'));
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
      dispatch(getNonBureauListSuccess(data));
      return data;
    })
    .catch((err) => {
      dispatch(getNonBureauListFailure(err));
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      return err;
    })
    .finally(() => {
      dispatch(removeLoader('getNonBureauList'));
    });
};

export const getNonBureauListRequest = (params) => {
  return {
    type: 'PREMIUM_PROCESSING_NON_BUREAU_LIST_GET_REQUEST',
    payload: params,
  };
};

export const getNonBureauListSuccess = (data) => {
  return {
    type: 'PREMIUM_PROCESSING_NON_BUREAU_LIST_GET_SUCCESS',
    payload: {
      items: data.data,
    },
  };
};

export const getNonBureauListFailure = (error) => {
  return {
    type: 'PREMIUM_PROCESSING_NON_BUREAU_LIST_GET_FAILURE',
    payload: error,
  };
};
