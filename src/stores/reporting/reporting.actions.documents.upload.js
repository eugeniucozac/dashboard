// app
import {
  addLoader,
  authLogout,
  enqueueNotification,
  hideModal,
  removeLoader,
  postUploadRequest,
  postUploadSuccess,
  postUploadFailure,
} from 'stores';
import * as utils from 'utils';

export const uploadReportingDocument =
  ({ data, reportGroupId, reportingFolder }) =>
  (dispatch, getState) => {
    const state = getState();

    // prettier-ignore
    const { user: { auth }, config: { vars: { endpoint } } } = state;

    dispatch(postUploadRequest({ data, reportGroupId }));
    dispatch(addLoader('uploadDocument'));

    if (!data.file || !reportGroupId) {
      dispatch(enqueueNotification('notification.document.fail', 'error'));
      dispatch(removeLoader('uploadDocument'));
      return;
    }

    let form = new FormData();
    form.append('uploaderEmail', state.user.emailId);
    form.append('uploaderFullName', state.user.fullName);
    form.append('teamId', 'unknown'); /*TODO*/
    form.append('teamName', 'unknown'); /*TODO*/
    form.append('reportGroupFolderId', reportingFolder?.id);
    form.append('folder', reportingFolder?.label);
    data?.file?.forEach((file) => form.append('file', file));

    return utils.api
      .multiPartPost({
        token: auth.accessToken,
        endpoint: endpoint.document,
        path: 'api/document',
        headers: {
          'Content-Type': 'multipart/form-data',
        },

        data: form,
      })
      .then((response) => utils.api.handleResponse(response))
      .then((json) => utils.api.handleData(json))
      .then((data) => {
        dispatch(postUploadSuccess(data));
        dispatch(enqueueNotification('notification.document.success', 'success'));
      })
      .catch((err) => {
        const errorParams = {
          file: 'stores/document.actions',
          message: 'API multipart post error (document)',
        };
        dispatch(postUploadFailure(err));
        utils.api.handleError(err, errorParams);
        utils.api.handleUnauthorized(err, dispatch, authLogout);
        dispatch(enqueueNotification('notification.document.fail', 'error'));
      })
      .finally(() => {
        dispatch(removeLoader('uploadDocument'));
        dispatch(hideModal());

        return;
      });
  };
