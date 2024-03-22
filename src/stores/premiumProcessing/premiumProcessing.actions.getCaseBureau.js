import { authLogout, addLoader, removeLoader } from 'stores';
import * as utils from 'utils';

export const getBureauList = (params) => (dispatch, getState) => {
  const {
    user: { auth },
    config: {
      vars: { endpoint },
    },
  } = getState();

  const { caseIncidentID } = params;

  const request = {
    caseIncidentID,
    issueDocsType: 'Bureau',
  };

  dispatch(getBureauListRequest(request));
  dispatch(addLoader('getBureauList'));
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
      dispatch(getBureauListSuccess(data));
      return data;
    })
    .catch((err) => {
      dispatch(getBureauListFailure(err));
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      return err;
    })
    .finally(() => {
      dispatch(removeLoader('getBureauList'));
    });
};

export const getBureauListRequest = (params) => {
  return {
    type: 'PREMIUM_PROCESSING_BUREAU_LIST_GET_REQUEST',
    payload: params,
  };
};

export const getBureauListSuccess = (data) => {
  return {
    type: 'PREMIUM_PROCESSING_BUREAU_LIST_GET_SUCCESS',
    payload: {
      items: data.data,
    },
  };
};

export const getBureauListFailure = (error) => {
  return {
    type: 'PREMIUM_PROCESSING_BUREAU_LIST_GET_FAILURE',
    payload: error,
  };
};
