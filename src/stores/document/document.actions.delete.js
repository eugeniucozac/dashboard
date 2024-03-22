// app
import { addLoader, authLogout, enqueueNotification, hideModal, removeLoader } from 'stores';
import * as utils from 'utils';

export const deleteDocument = (id) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}} = getState();

  dispatch(addLoader('deleteDocument'));

  utils.api
    .delete({
      token: auth.accessToken,
      endpoint: endpoint.document,
      path: `api/document/${id}`,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleData(json))
    .then(() => {
      dispatch(deleteDocumentSuccess({ id }));
      dispatch(enqueueNotification('notification.document.deleteSuccess', 'success'));
    })
    .catch((err) => {
      dispatch(enqueueNotification('notification.document.deleteFail', 'error'));
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      utils.api.handleError(err, {
        file: 'stores/document.actions',
        message: 'API multipart post error (document)',
      });
    })
    .finally(() => {
      dispatch(removeLoader('deleteDocument'));
      dispatch(hideModal());
    });
};

const deleteDocumentSuccess = (payload) => {
  return {
    type: 'DELETE_DOCUMENT_SUCCESS',
    payload,
  };
};
