import * as utils from 'utils';
import { authLogout } from 'stores';

export const getMultipleContextDocuments = (params) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint } } } = getState();

  const defaultError = {
    file: 'stores/dms.actions.getMultipleContextDocuments',
  };

  dispatch(getMultipleContextDocumentsRequest(params));

  return utils.api
    .post({
      token: auth.accessToken,
      endpoint: endpoint.dmsService,
      path: `dms/document/list?srcApplication=BOTH`,
      data: params,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleNewData(json))
    .then((data) => {
      dispatch(getMultipleContextDocumentsSuccess(data.data));
      return data;
    })
    .catch((error) => {
      dispatch(getMultipleContextDocumentsFailure(error, defaultError));
      utils.api.handleUnauthorized(error, dispatch, authLogout);
      return error;
    });
};

export const getMultipleContextDocumentsRequest = (payload) => {
  return {
    type: 'DMS_GET_MULTIPLE_CONTEXT_DOCUMENTS_REQUEST',
    payload,
  };
};

export const getMultipleContextDocumentsSuccess = (data) => {
  return {
    type: 'DMS_GET_MULTIPLE_CONTEXT_DOCUMENTS_SUCCESS',
    payload: data,
  };
};

export const getMultipleContextDocumentsFailure = (error) => {
  return {
    type: 'DMS_GET_MULTIPLE_CONTEXT_DOCUMENTS_FAILURE',
    payload: error,
  };
};
