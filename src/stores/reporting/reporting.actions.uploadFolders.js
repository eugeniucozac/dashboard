// app
import { addLoader, authLogout, enqueueNotification, removeLoader } from 'stores';
import * as utils from 'utils';

export const uploadReportingFolders =
  ({ payload, reportGroupId }) =>
  (dispatch, getState) => {
    const state = getState();

    // prettier-ignore
    const { user: { auth }, config: { vars: { endpoint } } } = state;

    dispatch(postFolderUploadRequest({ payload, reportGroupId }));
    dispatch(addLoader('uploadReportingFolders'));

    if (!payload?.value || !reportGroupId) {
      dispatch(enqueueNotification('notification.folder.fail', 'error'));
      dispatch(removeLoader('uploadReportingFolders'));
      return;
    }

    const data = {
      folderName: payload?.value,
    };

    return utils.api
      .post({
        token: auth.accessToken,
        endpoint: endpoint.document,
        path: `api/report-group/${reportGroupId}/folder`,
        data,
      })
      .then((response) => utils.api.handleResponse(response))
      .then((json) => utils.api.handleData(json))
      .then((data) => {
        dispatch({ type: 'DOCUMENT_UPLOAD_SUCCESS_REPORTING', payload: data });
      })
      .catch((err) => {
        const errorParams = {
          file: 'stores/document.actions',
          message: 'API multipart post error (document)',
        };
        dispatch(postFolderUploadFailure(err));
        utils.api.handleError(err, errorParams);
        utils.api.handleUnauthorized(err, dispatch, authLogout);
        dispatch(enqueueNotification('notification.folder.fail', 'error'));
      })
      .finally(() => {
        dispatch(removeLoader('uploadReportingFolders'));
        return;
      });
  };

export const postFolderUploadRequest = (payload) => {
  return {
    type: 'RERPORTING_FOLDERS_UPLOAD_POST_REQUEST',
    payload,
  };
};

export const postFolderUploadFailure = (error) => {
  return {
    type: 'RERPORTING_FOLDERS_UPLOAD_POST_FAILURE',
    payload: error,
  };
};
