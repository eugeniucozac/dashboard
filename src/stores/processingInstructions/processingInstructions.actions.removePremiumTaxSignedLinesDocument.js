// app
import { addLoader, authLogout, storeProcessingInstructionDocuments, enqueueNotification, removeLoader } from 'stores';
import * as utils from 'utils';
import * as constants from 'consts';

export const removePremiumTaxSignedLinesDocument = (formData) => (dispatch, getState) => {
  const state = getState();

  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint } },  } = state;
  const { docIds, removeDocumentType, documents } = formData;

  const defaultError = {
    file: 'stores/processingInstructions.actions.removePremiumTaxSignedLinesDocument',
  };

  dispatch(removePremiumTaxSignedLinesDocumentRequest(docIds));
  dispatch(addLoader({ key: 'removePremiumTaxSignedLinesDocument', message: utils.string.t('fileRemove.removing') }));

  if (!docIds) {
    dispatch(
      removePremiumTaxSignedLinesDocumentFailure({
        ...defaultError,
        message: utils.string.t('processingInstructions.missingRemoveFileDataParameters'),
      })
    );
    dispatch(enqueueNotification('notification.fileUpload.upload.fail', 'error'));
    dispatch(removeLoader('removePremiumTaxSignedLinesDocument'));
    return;
  }

  return utils.api
    .delete({
      token: auth.accessToken,
      endpoint: endpoint.dmsService,
      path: `dms/document/${docIds}`,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleNewData(json))
    .then((data) => {
      const updatedDocuments = {
        ...documents,
        ...(removeDocumentType === constants.DMS_DOCUMENT_TYPE_SECTION_KEYS.piPremiumCalculation && { premiumTaxDocument: null }),
        ...(removeDocumentType === constants.DMS_DOCUMENT_TYPE_SECTION_KEYS.piMarketSigned && { signedLinesDocument: null }),
      };

      dispatch(storeProcessingInstructionDocuments(updatedDocuments));
      dispatch(removePremiumTaxSignedLinesDocumentSuccess(data.data));
      dispatch(enqueueNotification(data.message, 'success'));
      return data;
    })
    .catch((err) => {
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(removePremiumTaxSignedLinesDocumentFailure(err));
      dispatch(enqueueNotification('notification.fileRemove.remove.fail', 'error'));
      return err;
    })
    .finally(() => {
      dispatch(removeLoader('removePremiumTaxSignedLinesDocument'));
    });
};

export const removePremiumTaxSignedLinesDocumentRequest = (payload) => {
  return {
    type: 'REMOVE_PREMIUM_TAX_SIGNED_LINES_DOCUMENT_REQUEST',
    payload,
  };
};

export const removePremiumTaxSignedLinesDocumentSuccess = (data) => {
  return {
    type: 'REMOVE_PREMIUM_TAX_SIGNED_LINES_DOCUMENT_SUCCESS',
    payload: data,
  };
};

export const removePremiumTaxSignedLinesDocumentFailure = (error) => {
  return {
    type: 'REMOVE_PREMIUM_TAX_SIGNED_LINES_DOCUMENT_FAILURE',
    payload: error,
  };
};
