// app
import { addLoader, authLogout, removeLoader, enqueueNotification } from 'stores';
import * as utils from 'utils';
import { API_STATUS_NOT_FOUND } from 'consts';

export const viewDocumentsMultiDownload = (docIds) => (dispatch, getState) => {
  // prettier-ignore
  const {
    user: { auth },
    config: {
      vars: { endpoint },
    },
  } = getState();

  const defaultError = {
    file: 'stores/dms.actions.viewDocumentsMultiDownload',
  };

  dispatch(addLoader('viewDocumentsMultiDownload'));
  dispatch(viewDocumentsMultiDownloadRequest(docIds));

  if (!docIds) {
    dispatch(removeLoader('viewDocumentsMultiDownload'));
    dispatch(viewDocumentsMultiDownloadFailure({ ...defaultError, message: 'Missing file parameters' }));
    return;
  }

  utils.api
    .get({
      token: auth.accessToken,
      endpoint: endpoint.dmsService,
      path: `dms/document/downloadZip/${docIds}`,
    })
    .then((response) => {
      if (!response.ok) {
        dispatch(
          response?.status === API_STATUS_NOT_FOUND
            ? enqueueNotification('dms.fileDownload.fileNotFound', 'error')
            : enqueueNotification('dms.fileDownload.fail', 'error')
        );
      } else {
        return utils.api.handleResponseBlob(response);
      }
    })
    .then((blob) => {
      utils.file.download(blob, `Documents-${docIds.join('-')}.zip`);
    })
    .catch((err) => {
      const errorParams = {
        file: 'stores/dms.actions',
        message: 'API fetch error (viewDocumentsMultiDownload)',
      };
      utils.api.handleError(err, errorParams);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
    })
    .finally(() => {
      dispatch(removeLoader('viewDocumentsMultiDownload'));
    });
};

export const viewDocumentsMultiDownloadRequest = (doc) => {
  return {
    type: 'DMS_VIEW_DOCUMENTS_DOWNLOAD_MULTI_REQUEST',
    payload: doc,
  };
};

export const viewDocumentsMultiDownloadFailure = (error) => {
  return {
    type: 'DMS_VIEW_DOCUMENTS_DOWNLOAD_MULTI_FAILURE',
    payload: error,
  };
};
