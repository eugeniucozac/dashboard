// app
import { addLoader, authLogout, enqueueNotification, hideModal, removeLoader, storeProcessingInstructionDocuments } from 'stores';
import * as utils from 'utils';
import * as constants from 'consts';

export const uploadPremiumTaxSignedLinesDocument = (formData) => (dispatch, getState) => {
  const state = getState();

  // prettier-ignore
  const { user:{ auth, id}, config: { vars: { endpoint } },  referenceData: {businessProcesses} } = state;

  const { files, documents, riskRef, uploadDocumentType, objectType, instruction } = formData;
  const businessProcess = businessProcesses?.find((bp) => bp.businessProcessID === instruction?.businessProcessId)?.businessProcessName;

  const defaultError = {
    file: 'stores/processingInstructions.actions.uploadPremiumTaxSignedLinesDocument',
  };

  dispatch(uploadPremiumTaxSignedLinesDocumentRequest(files));
  dispatch(addLoader({ key: 'uploadPremiumTaxSignedLinesDocument', message: utils.string.t('fileUpload.uploading') }));

  const validFormData =
    riskRef?.departmentCode &&
    riskRef?.policyUID &&
    riskRef?.riskRefId &&
    riskRef?.xbPolicyId &&
    uploadDocumentType &&
    riskRef?.xbInstanceId &&
    objectType &&
    utils.generic.isValidArray(files, true);

  if (!formData || !validFormData) {
    dispatch(
      uploadPremiumTaxSignedLinesDocumentFailure({
        ...defaultError,
        message: utils.string.t('processingInstructions.missingUploadFileDataParameters'),
      })
    );

    if (!riskRef?.departmentCode) dispatch(enqueueNotification('notification.fileUpload.upload.departmentCodeMissing', 'error'));
    else dispatch(enqueueNotification('notification.fileUpload.upload.fail', 'error'));

    dispatch(removeLoader('uploadPremiumTaxSignedLinesDocument'));
    return;
  }

  let form = new FormData();

  files.forEach((fileObj) => {
    if (fileObj.file) {
      form.append('uploadFiles', fileObj.file);
    }
  });

  const processDocumentDTOJson = {
    endorsementId: 0,
    endorsementUid: null,
    departmentCode: riskRef.departmentCode,
    instructionId: instruction.id,
    businessProcess: businessProcess,
    policyUid: riskRef.policyUID,
    policyRef: riskRef.riskRefId,
    documentTypeId: null,
    policyId: riskRef.xbPolicyId,
    documentTypeDescription: uploadDocumentType,
    sourceId: riskRef.xbInstanceId,
    objectType: objectType,
    documentSource: 'GXB', // In future documentSource will be dynamic value and coming from riskreference object
    createdBy: id, //After RBAC implementation in the api side remove this createdBy
  };

  form.append('processDocumentDTOJson', JSON.stringify(processDocumentDTOJson));

  return utils.api
    .multiPartPost({
      token: auth.accessToken,
      endpoint: endpoint.dmsService,
      path: 'gxbUploadDocument',
      data: form,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleNewData(json))
    .then((json) => {
      const newFiles = json.data;
      if (!utils.generic.isValidArray(newFiles)) return;
      const newGxbDocs = [];
      newFiles.forEach((file) => {
        let newFile = {};
        newFile.departmentCode = file?.departmentCode;
        newFile.folderUuid = file?.folderUid;
        newFile.name = file?.documentName;
        newFile.path = file?.documentPath;
        newFile.policyId = file?.policyId;
        newFile.sectionType = file?.sectionType;
        newFile.source = file?.documentSource;
        newFile.typeId = file?.documentTypeId;
        newFile.uuid = file?.documentUid;
        newFile.documentId = file?.documentId;
        newFile.version = file?.version;
        newGxbDocs.push(newFile);
      });

      const updatedDocuments = {
        ...documents,
        ...(uploadDocumentType === constants.PI_PREMIUM_CALCULATION_SHEET && { premiumTaxDocument: newGxbDocs[0] }),
        ...(uploadDocumentType === constants.PI_MARKET_SIGNED_SLIP && { signedLinesDocument: newGxbDocs[0] }),
      };

      dispatch(storeProcessingInstructionDocuments(updatedDocuments));
      dispatch(uploadPremiumTaxSignedLinesDocumentSuccess(json.data));
      dispatch(enqueueNotification(json.message, 'success'));
      return json.data;
    })
    .catch((err) => {
      const errorParams = {
        file: 'stores/processingInstructions.actions.uploadPremiumTaxSignedLinesDocument',
        message: utils.string.t('processingInstructions.apiMultipartPostError(uploadPremiumTaxSignedLinesDocument))'),
      };

      dispatch(uploadPremiumTaxSignedLinesDocumentFailure(err));
      utils.api.handleError(err, errorParams);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      if (err.response.status === constants.API_STATUS_NOT_FOUND) {
        dispatch(enqueueNotification(err.json.message, 'error'));
      } else {
        dispatch(enqueueNotification('notification.fileUpload.upload.fail', 'error'));
      }
    })
    .finally(() => {
      dispatch(removeLoader('uploadPremiumTaxSignedLinesDocument'));
      dispatch(hideModal());
      return;
    });
};

export const uploadPremiumTaxSignedLinesDocumentRequest = (payload) => {
  return {
    type: 'UPLOAD_PREMIUM_TAX_SIGNED_LINES_DOCUMENT_REQUEST',
    payload,
  };
};

export const uploadPremiumTaxSignedLinesDocumentSuccess = (data) => {
  return {
    type: 'UPLOAD_PREMIUM_TAX_SIGNED_LINES_DOCUMENT_SUCCESS',
    payload: {
      data,
    },
  };
};

export const uploadPremiumTaxSignedLinesDocumentFailure = (error) => {
  return {
    type: 'UPLOAD_PREMIUM_TAX_SIGNED_LINES_DOCUMENT_FAILURE',
    payload: error,
  };
};
