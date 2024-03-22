import { addLoader, authLogout, removeLoader } from 'stores';
import * as utils from 'utils';

export const unlinkDmsViewDocuments = (params) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}} = getState();

  const defaultError = {
    file: 'stores/dms.actions.unlinkDmsViewDocuments',
  };

  dispatch(unlinkDmsViewDocumentsRequest(params));
  dispatch(addLoader('unlinkDmsViewDocuments'));

  if (!params) {
    dispatch(unlinkDmsViewDocumentsFailure({ ...defaultError, message: 'Missing params' }));
    dispatch(removeLoader('unlinkDmsViewDocuments'));
    return;
  }

  return utils.api
    .post({
      token: auth.accessToken,
      endpoint: endpoint.dmsService,
      path: 'dms/documet/unlink',
      data: params,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleNewData(json))
    .then((data) => {
      dispatch(unlinkDmsViewDocumentsSuccess(data));
      return data;
    })
    .catch((err) => {
      utils.api.handleError(err, defaultError);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(unlinkDmsViewDocumentsFailure(err));
      return err;
    })
    .finally(() => {
      dispatch(removeLoader('unlinkDmsViewDocuments'));
    });
};

export const unlinkDmsViewDocumentsRequest = (data) => {
  return {
    type: 'DMS_UNLINK_VIEW_DOCUMENTS_REQUEST',
    payload: data,
  };
};

export const unlinkDmsViewDocumentsSuccess = (data) => {
  return {
    type: 'DMS_UNLINK_VIEW_DOCUMENTS_SUCCESS',
    payload: data,
  };
};

export const unlinkDmsViewDocumentsFailure = (error) => {
  return {
    type: 'DMS_UNLINK_VIEW_DOCUMENTS_FAILURE',
    payload: error,
  };
};
