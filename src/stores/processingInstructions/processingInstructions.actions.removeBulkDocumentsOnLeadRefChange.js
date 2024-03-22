// app
import { addLoader, authLogout, storeProcessingInstructionDocuments, enqueueNotification, removeLoader } from 'stores';
import * as utils from 'utils';

export const removeBulkDocumentsOnLeadRefChange = (formData) => (dispatch, getState) => {
  const state = getState();

  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint } },  } = state;
  const { documents } = formData;

  const defaultError = {
    file: 'stores/processingInstructions.actions.removeBulkDocumentsOnLeadRefChange',
  };

  dispatch(removeBulkDocumentsOnLeadRefChangeRequest(formData));
  dispatch(addLoader({ key: 'removeBulkDocumentsOnLeadRefChange', message: utils.string.t('fileRemove.removing') }));

  const validFormData = documents?.premiumTaxDocument || documents?.signedLinesDocument;

  if (!formData || !validFormData) {
    dispatch(
      removeBulkDocumentsOnLeadRefChangeFailure({
        ...defaultError,
        message: utils.string.t('processingInstructions.missingRemoveFileDataParameters'),
      })
    );
    dispatch(enqueueNotification('notification.fileUpload.upload.fail', 'error'));
    dispatch(removeLoader('removeBulkDocumentsOnLeadRefChange'));
    return;
  }

  const deleteDocumentIds = (docs) => {
    let docIds = '';
    if (docs.premiumTaxDocument) {
      docIds += docs.premiumTaxDocument?.documentId;
      if (docs.signedLinesDocument) {
        docIds += `,${docs.signedLinesDocument?.documentId}`;
      }
    } else if (docs.signedLinesDocument) {
      docIds += docs.signedLinesDocument?.documentId;
    }

    return docIds;
  };

  return utils.api
    .delete({
      token: auth.accessToken,
      endpoint: endpoint.dmsService,
      path: `dms/document/${deleteDocumentIds(documents)}`,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleNewData(json))
    .then((data) => {
      const updatedDocuments = {
        ...documents,
        ...(data.data[documents?.premiumTaxDocument?.documentId] && { premiumTaxDocument: null }),
        ...(data.data[documents?.signedLinesDocument?.documentId] && { signedLinesDocument: null }),
      };

      dispatch(storeProcessingInstructionDocuments(updatedDocuments));
      dispatch(removeBulkDocumentsOnLeadRefChangeSuccess(data.data));

      if (documents?.premiumTaxDocument && documents?.signedLinesDocument) {
        if (data.data[documents?.premiumTaxDocument?.documentId] || data.data[documents?.signedLinesDocument?.documentId]) {
          dispatch(enqueueNotification(data.message, 'success'));
          return data;
        }
      } else if (documents?.premiumTaxDocument && data.data[documents?.premiumTaxDocument?.documentId]) {
        dispatch(enqueueNotification(data.message, 'success'));
        return data;
      } else if (documents?.signedLinesDocument && data.data[documents?.signedLinesDocument?.documentId]) {
        dispatch(enqueueNotification(data.message, 'success'));
        return data;
      }
      if (!data.data[documents?.premiumTaxDocument?.documentId] || !data.data[documents?.signedLinesDocument?.documentId]) {
        dispatch(enqueueNotification('notification.fileRemove.remove.fail', 'error'));
      }
    })
    .catch((err) => {
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(removeBulkDocumentsOnLeadRefChangeFailure(err));
      dispatch(enqueueNotification('notification.fileRemove.remove.fail', 'error'));
      return err;
    })
    .finally(() => {
      dispatch(removeLoader('removeBulkDocumentsOnLeadRefChange'));
    });
};

export const removeBulkDocumentsOnLeadRefChangeRequest = (payload) => {
  return {
    type: 'PI_REMOVE_BULK_DOCUMENTS_ON_LEAD_REF_CHANGE_REQUEST',
    payload,
  };
};

export const removeBulkDocumentsOnLeadRefChangeSuccess = (data) => {
  return {
    type: 'PI_REMOVE_BULK_DOCUMENTS_ON_LEAD_REF_CHANGE_SUCCESS',
    payload: {
      data,
    },
  };
};

export const removeBulkDocumentsOnLeadRefChangeFailure = (error) => {
  return {
    type: 'PI_REMOVE_BULK_DOCUMENTS_ON_LEAD_REF_CHANGE_FAILURE',
    payload: error,
  };
};
