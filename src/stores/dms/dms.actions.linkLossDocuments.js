import * as utils from 'utils';
import { authLogout } from 'stores';

export const linkLossDocuments = (params) => (dispatch, getState) => {
  const {
    user: { auth },
    config: {
      vars: { endpoint },
    },
  } = getState();

  const defaultError = {
    file: 'stores/dms.actions.linkLossDocuments',
  };

  const { lossRef, activeClaimRefList } = params;

  const apiParams = activeClaimRefList;

  dispatch(linkLossDocumentsRequest(params));

  if (!lossRef || !activeClaimRefList) {
    dispatch(linkLossDocumentsFailure({ ...defaultError, message: 'Missing params' }));
    return;
  }

  return utils.api
    .post({
      token: auth.accessToken,
      endpoint: endpoint.dmsService,
      path: `dms/document/linkLossDocuments?lossRef=${lossRef}`,
      data: apiParams,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleNewData(json))
    .then((data) => {
      dispatch(linkLossDocumentsSuccess(data));
      return data;
    })
    .catch((err) => {
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(linkLossDocumentsFailure(err));
      return err;
    });
};

export const linkLossDocumentsRequest = (data) => {
  return {
    type: 'DMS_LINK_LOSS_DOCUMENTS_REQUEST',
    payload: data,
  };
};

export const linkLossDocumentsSuccess = (data) => {
  return {
    type: 'DMS_LINK_LOSS_DOCUMENTS_SUCCESS',
    payload: data,
  };
};

export const linkLossDocumentsFailure = (error) => {
  return {
    type: 'DMS_LINK_LOSS_DOCUMENTS_FAILURE',
    payload: error,
  };
};
