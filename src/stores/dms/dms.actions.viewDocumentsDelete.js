import { addLoader, removeLoader, authLogout } from 'stores';
import * as utils from 'utils';

export const viewDocumentsDelete = (docIds) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}} = getState();

  dispatch(viewDocumentsDeleteRequest(docIds));
  dispatch(addLoader('viewDocumentsDelete'));

  const defaultError = {
    file: 'stores/dms.actions.viewDocumentsDelete',
  };

  if (!docIds) {
    dispatch(viewDocumentsDeleteFailure(defaultError));
    dispatch(removeLoader('viewDocumentsDelete'));
    return;
  }

  return utils.api
    .delete({
      token: auth.accessToken,
      endpoint: endpoint.dmsService,
      path: `dms/document/${docIds}`,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleNewData(json))
    .then((data) => {
      dispatch(viewDocumentsDeleteSuccess(data));
      return data;
    })
    .catch((err) => {
      utils.api.handleError(err, { ...defaultError, message: 'API fetch error (dms.actions.viewDocumentsDelete)' });
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(viewDocumentsDeleteFailure(err));
      return err;
    })
    .finally(() => {
      dispatch(removeLoader('viewDocumentsDelete'));
    });
};

export const viewDocumentsDeleteRequest = (payload) => {
  return {
    type: 'DMS_VIEW_DOCUMENTS_DELETE_REQUEST',
    payload,
  };
};

export const viewDocumentsDeleteSuccess = (payload) => {
  return {
    type: 'DMS_VIEW_DOCUMENTS_DELETE_SUCCESS',
    payload,
  };
};

export const viewDocumentsDeleteFailure = (error) => {
  return {
    type: 'DMS_VIEW_DOCUMENTS_DELETE_FAILURE',
    payload: error,
  };
};
