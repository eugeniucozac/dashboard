// app
import { addLoader, authLogout, removeLoader, enqueueNotification } from 'stores';
import * as utils from 'utils';
import * as constants from 'consts';

export const viewDocumentsDownload =
  (doc, viewDoc = false) =>
  (dispatch, getState) => {
    // prettier-ignore
    const { user: { auth }, config: { vars: { endpoint }, }, dms: { search: { files = [] } } } = getState();

    const { documentId, documentName } = doc;
    const documentSource = files?.data?.searchValue?.find((file) => file.documentId === documentId)?.documentSource;

    const defaultError = {
      file: 'stores/dms.actions.viewDocumentsDownload',
    };
    const ext = utils.file.getFileExtensionFromFilename(documentName).toLowerCase();
    dispatch(addLoader('viewDocumentsDownload'));
    dispatch(viewDocumentsDownloadRequest(doc));

    if (!documentId || !documentName) {
      dispatch(removeLoader('viewDocumentsDownload'));
      dispatch(viewDocumentsDownloadFailure({ ...defaultError, message: 'Missing file parameters' }));
      return;
    }

    if (viewDoc && constants.MS_OFFICE_DOC_TYPES.includes(ext)) {
      dispatch(removeLoader('viewDocumentsDownload'));
      return Promise.resolve({
        url: `${constants.MS_OFFICE_DOC_VIEWER_URL}${utils.getUrl(endpoint.dmsService, `dms/document/view/${documentId}`, {
          src: `Bearer ${auth.accessToken}`,
        })}`,
        ext,
        mimeType: utils.file.getFileMimeTypefromFileExtension(ext),
      });
    }

    return utils.api
      .get({
        token: auth.accessToken,
        endpoint: endpoint.dmsService,
        path: `dms/document/download/${documentId}`,
      })
      .then((response) => {
        if (!response.ok) {
          dispatch(
            documentSource === 'GXB'
              ? enqueueNotification('dms.fileDownload.fileNotFound', 'error')
              : response?.status === constants.API_STATUS_NOT_FOUND
              ? enqueueNotification('dms.fileDownload.fileNotFound', 'error')
              : enqueueNotification('dms.fileDownload.fail', 'error')
          );
          return null;
        } else {
          return viewDoc ? response.arrayBuffer() : response.blob();
        }
      })
      .then((blob) => {
        return viewDoc ? utils.file.viewDoc(blob, documentName) : utils.file.download(blob, documentName);
      })
      .catch((err) => {
        const errorParams = {
          file: 'stores/dms.actions',
          message: 'API fetch error (viewDocumentsDownload)',
        };
        utils.api.handleError(err, errorParams);
        utils.api.handleUnauthorized(err, dispatch, authLogout);
      })
      .finally(() => {
        dispatch(removeLoader('viewDocumentsDownload'));
      });
  };

export const viewDocumentsDownloadRequest = (doc) => {
  return {
    type: 'DMS_VIEW_DOCUMENTS_DOWNLOAD_REQUEST',
    payload: doc,
  };
};

export const viewDocumentsDownloadFailure = (error) => {
  return {
    type: 'DMS_VIEW_DOCUMENTS_DOWNLOAD_FAILURE',
    payload: error,
  };
};
