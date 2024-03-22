// app
import { addLoader, authLogout, removeLoader } from 'stores';
import * as utils from 'utils';

export const getSlipDownloadForProcessingInstruction = (params, riskRef, isEndorsement) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}} = getState();
  const { name, folderUuid, uuid, path } = params;
  const { policyUID, departmentCode, xbInstance } = riskRef;

  const defaultError = {
    file: 'stores/processingInstructions.actions.getSlipDownloadForProcessingInstruction',
  };
  dispatch(addLoader('getSlipDownloadForProcessingInstruction'));
  dispatch(getSlipDownloadForProcessingInstructionRequest(params));

  if (!departmentCode || !uuid || !policyUID || !folderUuid || !path || !xbInstance) {
    dispatch(removeLoader('getSlipDownloadForProcessingInstruction'));
    dispatch(
      getSlipDownloadForProcessingInstructionFailure({
        ...defaultError,
        message: utils.string.t('processingInstructions.missingFileParameters'),
      })
    );
    return;
  }

  const extension = path.split('.').pop();
  const documentName = name + '.' + extension;

  utils.api
    .post({
      token: auth.accessToken,
      endpoint: endpoint.dmsService,
      path: 'gxb/document/download',
      params: {
        department: departmentCode,
        policyUUID: policyUID,
        folderUUID: folderUuid,
        documentUUID: uuid,
        xbInstance: xbInstance,
        ...(isEndorsement && { endorsementUUID: riskRef?.bulkEndorsementUid }),
      },
    })
    .then((response) => response.blob())
    .then((blob) => utils.file.download(blob, documentName))
    .catch((err) => {
      const errorParams = {
        file: 'stores/processingInstructions.actions.getSlipDownloadForProcessingInstruction',
        message: utils.string.t('processingInstructions.apiFetchError'),
      };
      utils.api.handleError(err, errorParams);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
    })
    .finally(() => {
      dispatch(removeLoader('getSlipDownloadForProcessingInstruction'));
    });
};

export const getSlipDownloadForProcessingInstructionRequest = (params) => {
  return {
    type: 'PROCESSING_INSTRUCTIONS_GET_SLIP_DOWNLOAD_REQUEST',
    payload: params,
  };
};

export const getSlipDownloadForProcessingInstructionSuccess = (responseData) => {
  return {
    type: 'PROCESSING_INSTRUCTIONS_GET_SLIP_DOWNLOAD_SUCCESS',
    payload: responseData,
  };
};

export const getSlipDownloadForProcessingInstructionFailure = (error) => {
  return {
    type: 'PROCESSING_INSTRUCTIONS_GET_SLIP_DOWNLOAD_FAILURE',
    payload: error,
  };
};
