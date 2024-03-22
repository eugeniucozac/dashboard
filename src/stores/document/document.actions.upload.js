// app
import { addLoader, authLogout, enqueueNotification, hideModal, removeLoader } from 'stores';
import * as utils from 'utils';
import * as constants from 'consts';

export const uploadDocument =
  ({ data, placement, documentType, documentTypeId, redirectionCallback }) =>
  (dispatch, getState) => {
    const state = getState();

    // prettier-ignore
    const { user: { auth }, config: { vars: { endpoint }}} = state;

    dispatch(postUploadRequest({ data, documentType, placement, documentTypeId }));
    dispatch(addLoader('uploadDocument'));

    const validProps = utils.generic.isValidObject(placement) || (documentType && documentTypeId);

    if (!data.folder || !data.file || !validProps) {
      dispatch(enqueueNotification('notification.document.fail', 'error'));
      dispatch(removeLoader('uploadDocument'));
      return;
    }

    let form = new FormData();
    form.append('uploaderEmail', state.user.emailId);
    form.append('uploaderFullName', state.user.fullName);
    form.append('teamId', 'unknown'); /*TODO*/
    form.append('teamName', 'unknown'); /*TODO*/

    if (placement) {
      form.append('placementId', placement.id);
      form.append('placementName', placement.insureds.map((insured) => insured.name).join(', '));
      form.append('placementYear', placement.inceptionDate.split('-')[0]);
    }

    if (documentType && documentType === constants.FOLDER_MODELLING) {
      form.append('modellingId', documentTypeId);
    }

    form.append('folder', data.folder);
    form.append('file', data.file);

    return utils.api
      .multiPartPost({
        token: auth.accessToken,
        endpoint: endpoint.document,
        path: 'api/document',
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

        if (utils.generic.isFunction(redirectionCallback)) {
          redirectionCallback();
          return;
        }

        return;
      });
  };

export const postUploadRequest = (payload) => {
  return {
    type: 'DOCUMENT_UPLOAD_POST_REQUEST',
    payload,
  };
};

export const postUploadSuccess = (data) => {
  return {
    type: 'DOCUMENT_UPLOAD_POST_SUCCESS',
    payload: {
      data,
    },
  };
};

export const postUploadFailure = (error) => {
  return {
    type: 'DOCUMENT_UPLOAD_POST_FAILURE',
    payload: error,
  };
};
