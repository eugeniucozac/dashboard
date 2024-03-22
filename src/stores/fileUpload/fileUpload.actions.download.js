// app
import { addLoader, authLogout, removeLoader } from 'stores';
import * as utils from 'utils';

export const fileUploadLinkDownload = (doc) => (dispatch, getState) => {
  // prettier-ignore
  const { user: {auth}, config: { vars: { endpoint }}} = getState();
  const { documentPath, documentName, xbinstance } = doc;

  const defaultError = {
    file: 'stores/fileUpload.actions.download',
  };

  dispatch(addLoader('fileUploadLinkDownload'));
  dispatch(fileUploadLinkDownloadRequest(doc));

  if (!documentPath || !documentName || !xbinstance) {
    dispatch(removeLoader('fileUploadLinkDownload'));
    dispatch(fileUploadLinkDownloadFailure({ ...defaultError, message: 'Missing file parameters' }));
    return;
  }

  utils.api
    .post({
      token: auth.accessToken,
      endpoint: endpoint.dmsService,
      path: `dms/document/download?documentPath=${documentPath}&instance=${xbinstance}`,
    })
    .then((response) => response.blob())
    .then((blob) => utils.file.download(blob, documentName))
    .catch((err) => {
      const errorParams = {
        file: 'stores/document.actions',
        message: 'API fetch error (fileUploadLinkDownload)',
      };
      utils.api.handleError(err, errorParams);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
    })
    .finally(() => {
      dispatch(removeLoader('fileUploadLinkDownload'));
    });
};

export const fileUploadLinkDownloadRequest = (doc) => {
  return {
    type: 'FILE_UPLOAD_LINK_DOWNLOAD_REQUEST',
    payload: doc,
  };
};

export const fileUploadLinkDownloadFailure = (error) => {
  return {
    type: 'FILE_UPLOAD_LINK_DOWNLOAD_FAILURE',
    payload: error,
  };
};
