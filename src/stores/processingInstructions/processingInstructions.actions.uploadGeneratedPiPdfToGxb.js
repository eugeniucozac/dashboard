// app
import { enqueueNotification, authLogout, hideModal } from 'stores';
import * as utils from 'utils';
import * as constants from 'consts';

export const uploadGeneratedPiPdfToGxb = (fileObj) => (dispatch, getState) => {
  const state = getState();

  // prettier-ignore
  const { user:{ auth }, config: { vars: { endpoint } } } = state;

  const { pdf, riskRef, documentTypesAfterFilter, instruction, metaData } = fileObj;
  const { documentTypeID, documentTypeDescription } = documentTypesAfterFilter[0];
  const {
    catCodesID,
    lossId,
    departmentId,
    departmentName,
    insuredName,
    policyId,
    policyRef,
    subDepartmentId,
    uniqueMarketRef,
    xbInstanceId,
    year,
  } = metaData;

  dispatch(uploadGeneratedPiPdfToGxbRequest(pdf));

  const pdfName = instruction?.hasOwnProperty('reopenedDate')
    ? `Processing-instruction-${instruction?.id}-${riskRef?.riskRefId}_new.pdf`
    : `Processing-instruction-${instruction?.id}-${riskRef?.riskRefId}.pdf`;

  let formData = new FormData();
  const newPdf = new File([pdf], pdfName, {
    type: 'application/pdf',
  });

  let docDto = [];
  formData.append('uploadFiles', newPdf);
  docDto.push({
    tags: [],
    documentName: pdfName,
    documentTypeId: documentTypeID,
    documentTypeDescription: documentTypeDescription,
    fileLastModifiedDate: new Date(),
    docClassification: '3',
    metadataFields: [],
  });

  formData.append(
    'fileUploadRequestPayload',
    JSON.stringify({
      catCodesID,
      lossId,
      sectionType: constants.DMS_CONTEXT_PROCESSING_INSTRUCTION,
      srcApplication: constants.DMS_SRC_APPLICATION_EDGE,
      referenceId: instruction?.id,
      xbInstanceId: xbInstanceId,
      departmentId,
      departmentName,
      insuredName,
      policyId,
      policyRef,
      subDepartmentId,
      uniqueMarketRef,
      year,
      documentDto: [...docDto],
    })
  );

  return utils.api
    .multiPartPost({
      token: auth.accessToken,
      endpoint: endpoint.dmsService,
      path: 'dms/document/upload',
      data: formData,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleNewData(json))
    .then((json) => {
      dispatch(uploadGeneratedPiPdfToGxbSuccess(json.data));
      dispatch(hideModal());
      return json.data;
    })
    .catch((err) => {
      const errorParams = {
        file: 'stores/processingInstructions.actions.uploadGeneratedPiPdfToGxb',
        message: utils.string.t('processingInstructions.apiMultipartPostError(uploadGeneratedPiPdfToGxb))'),
      };

      if (err?.response?.status === constants.API_STATUS_INTERNAL_SERVER_ERROR) dispatch(enqueueNotification(err?.json?.message, 'error'));
      else dispatch(enqueueNotification('notification.uploadDmsFile.fail', 'error'));

      dispatch(uploadGeneratedPiPdfToGxbFailure(err));
      utils.api.handleError(err, errorParams);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      return err;
    });
};

export const uploadGeneratedPiPdfToGxbRequest = (payload) => {
  return {
    type: 'UPLOAD_GENERATED_PROCESSING_INSTRUCTION_PDF_TO_GXB_REQUEST',
    payload,
  };
};

export const uploadGeneratedPiPdfToGxbSuccess = (data) => {
  return {
    type: 'UPLOAD_GENERATED_PROCESSING_INSTRUCTION_PDF_TO_GXB_SUCCESS',
    payload: {
      data,
    },
  };
};

export const uploadGeneratedPiPdfToGxbFailure = (error) => {
  return {
    type: 'UPLOAD_GENERATED_PROCESSING_INSTRUCTION_PDF_TO_GXB_FAILURE',
    payload: error,
  };
};
