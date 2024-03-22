// app
import { addLoader, authLogout, enqueueNotification, hideModal, removeLoader, storeProcessingInstructionDocuments } from 'stores';
import * as utils from 'utils';
import * as constants from 'consts';

export const uploadDocumentList = (formData) => (dispatch, getState) => {
  const state = getState();

  // prettier-ignore
  const { user:{ auth, id}, config: { vars: { endpoint } }, referenceData: {businessProcesses} } = state;

  const { instruction, documents, riskRef, files, objectType } = formData;

  const defaultError = {
    file: 'stores/processingInstructions.actions.uploadDocumentList',
  };

  dispatch(uploadDocumentListPostRequest(formData));
  dispatch(addLoader({ key: 'uploadDocumentList', message: utils.string.t('fileUpload.uploading') }));

  const businessProcess = businessProcesses?.find((bp) => bp.businessProcessID === instruction?.businessProcessId)?.businessProcessName;
  const validFormData =
    instruction?.id &&
    businessProcess &&
    riskRef?.departmentCode &&
    riskRef?.policyUID &&
    riskRef?.riskRefId &&
    riskRef?.xbPolicyId &&
    riskRef?.xbInstanceId &&
    objectType &&
    utils.generic.isValidArray(files, true);

  if (!formData || !validFormData) {
    dispatch(
      uploadDocumentListPostFailure({ ...defaultError, message: utils.string.t('processingInstructions.missingUploadFileDataParameters') })
    );

    if (!riskRef?.departmentCode) dispatch(enqueueNotification('notification.fileUpload.upload.departmentCodeMissing', 'error'));
    else dispatch(enqueueNotification('notification.fileUpload.upload.fail', 'error'));

    dispatch(removeLoader('uploadDocumentList'));
    return;
  }

  let form = new FormData();

  files.forEach((fileObj) => {
    if (fileObj.file) {
      form.append('uploadFiles', fileObj.file);
    }
  });

  const isEndorsement = utils.processingInstructions.isEndorsement(instruction?.processTypeId);
  const isBordereau = utils.processingInstructions.isBordereau(instruction?.processTypeId);
  const isFeeAndAmendment = utils.processingInstructions.isFeeAndAmendment(instruction?.processTypeId);

  const faBorderProcessType = isBordereau || isFeeAndAmendment;

  const processDocumentDTOJson = {
    endorsementId: isEndorsement ? riskRef.endorsementId : 0,
    endorsementUid: isEndorsement ? riskRef.bulkEndorsementUid : null,
    instructionId: instruction.id,
    businessProcess: businessProcess,
    departmentCode: riskRef.departmentCode,
    policyUid: riskRef.policyUID,
    policyRef: riskRef.riskRefId,
    documentTypeId: null,
    policyId: riskRef.xbPolicyId,
    documentTypeDescription: isEndorsement
      ? constants.PI_ENDORSEMENT_TYPE_DOCUMENT.documentTypeDescription
      : faBorderProcessType
      ? constants.PI_FABORDER_TYPE_DOCUMENT.documentTypeDescription
      : constants.PI_CLOSING_FDO_TYPE_DOCUMENT.documentTypeDescription,
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
        newFile.version = file?.version;
        newGxbDocs.push(newFile);
      });
      const updatedRiskRef = { ...riskRef, gxbDocuments: [...newGxbDocs, ...riskRef.gxbDocuments] };
      const updatedDocuments = {
        ...documents,
        riskReferences: Object.values(
          [...documents?.riskReferences, ...[updatedRiskRef]].reduce((result, { riskRefId, ...rest }) => {
            result[riskRefId] = {
              ...(result[riskRefId] || {}),
              riskRefId,
              ...rest,
            };
            return result;
          }, {})
        ),
      };
      dispatch(storeProcessingInstructionDocuments(updatedDocuments));
      dispatch(uploadDocumentListPostSuccess(json.data));
      dispatch(enqueueNotification(json.message, 'success'));
      return json.data;
    })
    .catch((err) => {
      const errorParams = {
        file: 'stores/processingInstructions.actions.uploadDocumentList',
        message: utils.string.t('processingInstructions.apiMultipartPostError'),
      };

      dispatch(uploadDocumentListPostFailure(err));
      utils.api.handleError(err, errorParams);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      if (err.response.status === constants.API_STATUS_NOT_FOUND) {
        dispatch(enqueueNotification(err.json.message, 'error'));
      } else {
        dispatch(enqueueNotification('notification.fileUpload.upload.fail', 'error'));
      }
    })
    .finally(() => {
      dispatch(removeLoader('uploadDocumentList'));
      dispatch(hideModal());
      return;
    });
};

export const uploadDocumentListPostRequest = (payload) => {
  return {
    type: 'UPLOAD_DOCUMENT_List_POST_REQUEST',
    payload,
  };
};

export const uploadDocumentListPostSuccess = (data) => {
  return {
    type: 'UPLOAD_DOCUMENT_List_POST_SUCCESS',
    payload: {
      data,
    },
  };
};

export const uploadDocumentListPostFailure = (error) => {
  return {
    type: 'UPLOAD_DOCUMENT_List_POST_FAILURE',
    payload: error,
  };
};
