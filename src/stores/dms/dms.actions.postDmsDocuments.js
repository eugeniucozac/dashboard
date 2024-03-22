import * as utils from 'utils';
import { enqueueNotification, authLogout } from 'stores';
import * as constants from 'consts';

export const postDmsDocuments = (params) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint } }, dms: { contextSubType: { type } }, processingInstructions: { selectedRiskRef } } = getState();
  // prettier-ignore
  const { context, documentTypeKey, submitData: filesFormData, submitFiles: uploadFiles } = params;

  // eslint-disable-next-line
  const referenceId = utils.dmsFormatter.getContextReferenceId(getState(), context, type);
  const { claimRef, lossRef, expiryDate, rfiCreatedOn } = utils.dmsFormatter.getUploadMetaDataParams(getState(), context, referenceId, type);
  const { endorsementId, bulkEndorsementUid: endorsementUid } = selectedRiskRef; // TODO to come as props rather than from metaData API

  let formData = new FormData();

  // Construct File's Byte Array request
  uploadFiles?.forEach((eachFile) => {
    if (eachFile?.name) {
      formData.append('uploadFiles', eachFile);
    }
  });

  // Construct Files's Upload Data Request
  formData.append(
    'fileUploadRequestPayload',
    JSON.stringify({
      sectionType: context,
      srcApplication: constants.DMS_SRC_APPLICATION_EDGE,
      referenceId,

      // TODO to come as props rather than from metaData API
      claimRef,
      lossRef,
      expiryDate,

      ...(
        context === constants.DMS_CONTEXT_TASK &&
        type === constants.DMS_TASK_CONTEXT_TYPE_RFI &&
        { rfiCreatedOn }
      ),
      ...(documentTypeKey === constants.DMS_DOCUMENT_TYPE_SECTION_KEYS.piEndorsement &&
        endorsementId &&
        endorsementUid && {
        endorsementId,
        endorsementUid,
      }),

      ...filesFormData,
    })
  );

  dispatch(postDmsDocumentsRequest(params));

  return utils.api
    .multiPartPost({
      token: auth.accessToken,
      endpoint: endpoint.dmsService,
      path: 'dms/document/upload',
      data: formData,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleNewData(json))
    .then((data) => {
      dispatch(enqueueNotification(data?.message, 'success'));
      dispatch(postDmsDocumentsSuccess(data?.data));
      return data;
    })

    .catch((err) => {
      const defaultError = {
        file: 'stores/dms.actions.postDmsDocuments',
      };

      if (err?.response?.status === constants.API_STATUS_INTERNAL_SERVER_ERROR) dispatch(enqueueNotification(err?.json?.message, 'error'));
      else dispatch(enqueueNotification('notification.uploadDmsFile.fail', 'error'));

      utils.api.handleError(err, defaultError);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(postDmsDocumentsFailure(err));
      return { err };
    });
};

export const postDmsDocumentsRequest = (params) => {
  return {
    type: 'DMS_POST_DOCUMENTS_REQUEST',
    payload: params,
  };
};

export const postDmsDocumentsSuccess = (data) => {
  return {
    type: 'DMS_POST_DOCUMENTS_SUCCESS',
    payload: data,
  };
};

export const postDmsDocumentsFailure = (err) => {
  return {
    type: 'DMS_POST_DOCUMENTS_ERROR',
    payload: err,
  };
};
