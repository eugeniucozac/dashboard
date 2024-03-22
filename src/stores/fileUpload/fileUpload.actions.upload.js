import get from 'lodash/get';

// app
import { addLoader, authLogout, enqueueNotification, hideModal, removeLoader } from 'stores';
import * as utils from 'utils';

export const fileUploadDocuments = (formData) => (dispatch, getState) => {
  const state = getState();

  // prettier-ignore
  const { user, config: { vars: { endpoint }}} = state;

  const defaultError = {
    file: 'stores/fileUpload.actions.upload',
  };

  dispatch(fileUploadDocumentsPostRequest(formData));
  dispatch(addLoader({ key: 'fileUploadDocuments', message: utils.string.t('fileUpload.uploading') }));

  const validFormData =
    formData?.department?.value &&
    formData?.expiryDate &&
    utils.generic.isValidArray(formData?.files, true) &&
    formData?.inceptionDate &&
    formData?.insuredName &&
    formData?.policyRef &&
    formData?.sectionType?.label &&
    formData?.sourceSystem?.value &&
    formData?.umr &&
    formData?.uploadBy?.label &&
    formData?.uploadDate &&
    formData?.xbInstance?.value;

  if (!formData || !validFormData) {
    dispatch(fileUploadDocumentsPostFailure({ ...defaultError, message: 'Missing policy data parameters' }));
    dispatch(enqueueNotification('notification.fileUpload.upload.fail', 'error'));
    dispatch(removeLoader('fileUploadDocuments'));
    return;
  }

  const nowIsoString = utils.date.toISOString(new Date());
  const files = get(formData, 'files', []);

  const screenRequestDTOJson = {
    createdBy: user.id,
    createdByName: utils.user.fullname(user),
    createdDate: nowIsoString,
    departmentName: formData.department?.value,
    divisionName: 'Test1',
    expiryDate: formData.expiryDate,
    inceptionDate: formData.inceptionDate,
    insuredId: formData.insuredID,
    insuredName: formData.insuredName,
    policyID: formData.policyID,
    riskreference: formData.policyRef,
    sectionType: formData.sectionType?.label,
    sharepointInstance: formData.xbInstance?.value,
    sourceId: formData.xbInstance?.id,
    srcApplication: formData.sourceSystem?.value,
    isActive: 1,
    uniqueMarketRef: formData.umr,
    year: utils.string.t('format.date', { value: { date: formData.inceptionDate, format: 'YYYY' } }),
  };

  const doctypes = [];
  let form = new FormData();

  files.forEach((fileObj, fileIndex) => {
    if (fileObj.file && fileObj.type?.id) {
      doctypes.push(fileObj.type.id);
      form.append('uploadFiles', fileObj.file);
    }
  });

  form.append('screenRequestDTOJson', JSON.stringify(screenRequestDTOJson));
  form.append('docTypeStr', doctypes.join(','));

  return utils.api
    .multiPartPost({
      // token: auth.accessToken,
      endpoint: endpoint.dmsService,
      path: 'dms/document/upload/multiple',
      data: form,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleNewData(json))
    .then((json) => {
      dispatch(fileUploadDocumentsPostSuccess(json.data));
      dispatch(enqueueNotification('notification.fileUpload.upload.success', 'success'));
      dispatch(hideModal());
      return json.data;
    })
    .catch((err) => {
      const errorParams = {
        file: 'stores/fileUpload.actions.upload',
        message: 'API multipart post error (fileUploadDocuments)',
      };

      dispatch(fileUploadDocumentsPostFailure(err));
      utils.api.handleError(err, errorParams);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(enqueueNotification('notification.fileUpload.upload.fail', 'error'));
    })
    .finally(() => {
      dispatch(removeLoader('fileUploadDocuments'));
      dispatch(hideModal());
      return;
    });
};

export const fileUploadDocumentsPostRequest = (payload) => {
  return {
    type: 'FILE_UPLOAD_DOCUMENT_POST_REQUEST',
    payload,
  };
};

export const fileUploadDocumentsPostSuccess = (data) => {
  return {
    type: 'FILE_UPLOAD_DOCUMENT_POST_SUCCESS',
    payload: {
      data,
    },
  };
};

export const fileUploadDocumentsPostFailure = (error) => {
  return {
    type: 'FILE_UPLOAD_DOCUMENT_POST_FAILURE',
    payload: error,
  };
};
