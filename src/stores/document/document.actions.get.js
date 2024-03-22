// app
import { addLoader, authLogout, enqueueNotification, removeLoader } from 'stores';
import * as utils from 'utils';

export const getDocuments =
  ({ placement, documentType, documentTypeId }) =>
  (dispatch, getState) => {
    // prettier-ignore
    const { user: { auth }, config: { vars: { endpoint } } } = getState();

    const validProps = utils.generic.isValidObject(placement) || (documentType && documentTypeId);

    if (!validProps) {
      dispatch(enqueueNotification('notification.document.getFail', 'error'));
      return;
    }

    dispatch(addLoader('getDocuments'));

    let route = '';

    if (documentType) {
      route = `document/${documentType.toLowerCase()}/${documentTypeId}`;
    }

    if (placement) {
      route = `placements/${placement.id}`;
    }

    utils.api
      .get({
        token: auth.accessToken,
        endpoint: endpoint.document,
        path: `api/${route}`,
      })
      .then((response) => utils.api.handleResponse(response))
      .then((json) => utils.api.handleData(json))
      .then((data) => {
        dispatch({ type: 'DOCUMENT_SET_FOLDER_STRUCTURE', payload: data.folders });
        dispatch({ type: 'DOCUMENTS_SET_FOR_PLACEMENT', payload: data.documents });
      })
      .catch((err) => {
        const errorParams = {
          file: 'stores/document.actions',
          message: 'API fetch error (document)',
        };

        utils.api.handleError(err, errorParams);
        utils.api.handleUnauthorized(err, dispatch, authLogout);
        dispatch(enqueueNotification('notification.document.getFail', 'error'));
      })
      .finally(() => {
        dispatch(removeLoader('getDocuments'));
      });
  };

export const getFolderList = () => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint } } } = getState();
  return utils.api
    .get({
      token: auth.accessToken,
      endpoint: endpoint.document,
      path: 'api/document/folders',
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleData(json))
    .then((data) =>
      utils.generic.getLabels(
        data.map((folder) => ({ id: folder.toUpperCase() })),
        'documents.folders'
      )
    )
    .catch((err) => {
      const errorParams = {
        file: 'stores/document.actions',
        message: 'API fetch error (document)',
      };

      utils.api.handleError(err, errorParams);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(enqueueNotification('notification.document.getFail', 'error'));
    });
};

export const getFolderListForReport = (reportGroupId) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint } } } = getState();

  return utils.api
    .get({
      token: auth.accessToken,
      endpoint: endpoint.document,
      path: `api/report-group/${reportGroupId}/folders`,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleData(json))
    .then((data) => {
      return data.map((item) => {
        return {
          ...item,
          label: item?.folderName,
        };
      });
    })
    .catch((err) => {
      const errorParams = {
        file: 'stores/document.actions',
        message: 'API fetch error (document)',
      };

      utils.api.handleError(err, errorParams);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(enqueueNotification('notification.document.getFail', 'error'));
    });
};
