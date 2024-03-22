import * as utils from 'utils';
import { addLoader, removeLoader, authLogout } from 'stores';
import config from 'config';
import moment from 'moment';

export const getFileUploadDocuments = (formData, params) => (dispatch, getState) => {
  // prettier-ignore
  const { user: {auth} } = getState();

  const defaultError = {
    file: 'stores/fileUpload.actions.getFileUploadDocuments',
  };

  dispatch(getFileUploadDocumentsRequest(formData, params));
  dispatch(addLoader('getFileUploadDocuments'));

  if (!formData || !params) {
    dispatch(getFileUploadDocumentsFailure({ ...defaultError, message: 'Missing parameters' }));
    dispatch(removeLoader('getFileUploadDocuments'));
    return;
  }

  return (
    utils.api
      // temporarily switching to GET to work in json-server
      .get({
        // .post({
        token: auth.accessToken,
        // endpoint: endpoint.dmsService,
        endpoint: 'http://localhost:9000',
        path: 'data/search/document',
        data: {
          department: formData.department?.value || '',
          documentTypeId: formData.documentType?.id || 0,
          inceptionYear: formData.inceptionYear ? moment(formData.inceptionYear).format('YYYY') : '',
          insuredName: formData.insuredName?.name || '',
          riskReference: formData.riskReference?.policyRef || '',
          instanceID: formData.xbInstance?.id || '',
          page: params.page || 1,
          pageSize: params.size || config.ui.pagination.default,
          sortBy: '',
          direction: '',
        },
      })
      .then((response) => utils.api.handleResponse(response))
      .then((json) => {
        if (json?.status === 'OK' && json?.data) {
          dispatch(getFileUploadDocumentsSuccess(json));
          return { data: json.data, pagination: json.pagination };
        } else {
          return Promise.reject({
            message: `API error${json.status ? ` (${json.status})` : ''}`,
            ...(json && { ...json }),
          });
        }
      })
      .catch((err) => {
        utils.api.handleError(err, { ...defaultError, message: 'API fetch error (fileUpload.getFileUploadDocuments)' });
        utils.api.handleUnauthorized(err, dispatch, authLogout);
        dispatch(getFileUploadDocumentsFailure(err));
        return err;
      })
      .finally(() => {
        dispatch(removeLoader('getFileUploadDocuments'));
      })
  );
};

export const getFileUploadDocumentsRequest = (formData, params) => {
  return {
    type: 'FILE_UPLOAD_GET_DOCUMENTS_REQUEST',
    payload: { formData, params },
  };
};

export const getFileUploadDocumentsSuccess = (json) => {
  return {
    type: 'FILE_UPLOAD_GET_DOCUMENTS_SUCCESS',
    payload: json,
  };
};

export const getFileUploadDocumentsFailure = (error) => {
  return {
    type: 'FILE_UPLOAD_GET_DOCUMENTS_FAILURE',
    payload: error,
  };
};
