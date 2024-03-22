// app
import { addLoader, authLogout, storeProcessingInstructionDocuments, enqueueNotification, removeLoader } from 'stores';
import * as utils from 'utils';

export const removeSlipDocument = (formData) => (dispatch, getState) => {
  const state = getState();

  // prettier-ignore
  const { user: { auth, id }, config: { vars: { endpoint } },  } = state;
  const { instruction, documents, riskRef, file } = formData;

  const defaultError = {
    file: 'stores/processingInstructions.actions.removeSlipDocument',
  };

  dispatch(removeSlipDocumentRequest(formData));
  dispatch(addLoader({ key: 'removeSlipDocument', message: utils.string.t('fileRemove.removing') }));

  const validFormData = riskRef?.departmentCode && riskRef?.policyUID && file?.folderUuid && file?.uuid && riskRef?.xbInstance;

  if (!formData || !validFormData) {
    dispatch(
      removeSlipDocumentFailure({
        ...defaultError,
        message: utils.string.t('processingInstructions.missingRemoveFileDataParameters'),
      })
    );
    dispatch(enqueueNotification('notification.fileUpload.upload.fail', 'error'));
    dispatch(removeLoader('removeSlipDocument'));
    return;
  }

  const isEndorsement = utils.processingInstructions.isEndorsement(instruction?.processTypeId);

  return utils.api
    .delete({
      token: auth.accessToken,
      endpoint: endpoint.dmsService,
      path: 'gxbRemoveDocument',
      params: {
        ...(isEndorsement && { endorsementUid: riskRef?.bulkEndorsementUid }),
        departmentCode: riskRef.departmentCode,
        policyUid: riskRef.policyUID,
        folderUid: file.folderUuid,
        documentUid: file.uuid,
        xbInstance: riskRef.xbInstance,
        updatedBy: id, //After RBAC implementation in the api side remove this updatedBy
      },
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleNewData(json))
    .then((data) => {
      const toDelete = data.data.documentUid;
      const index = riskRef?.gxbDocuments.findIndex(
        (o) => utils.string.replaceLowerCase(o.uuid) === utils.string.replaceLowerCase(toDelete)
      );
      if (index !== -1) riskRef?.gxbDocuments.splice(index, 1);
      const updatedRiskRef = {
        ...riskRef,
        gxbDocuments: riskRef?.gxbDocuments,
      };

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
      dispatch(removeSlipDocumentSuccess(data.data));
      dispatch(enqueueNotification(data.message, 'success'));
    })
    .catch((err) => {
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(removeSlipDocumentFailure(err));
      dispatch(enqueueNotification('notification.fileRemove.remove.fail', 'error'));
      return err;
    })
    .finally(() => {
      dispatch(removeLoader('removeSlipDocument'));
    });
};

export const removeSlipDocumentRequest = (payload) => {
  return {
    type: 'REMOVE_SLIP_DOCUMENT_REQUEST',
    payload,
  };
};

export const removeSlipDocumentSuccess = (data) => {
  return {
    type: 'REMOVE_SLIP_DOCUMENT_SUCCESS',
    payload: {
      data,
    },
  };
};

export const removeSlipDocumentFailure = (error) => {
  return {
    type: 'REMOVE_SLIP_DOCUMENT_FAILURE',
    payload: error,
  };
};
