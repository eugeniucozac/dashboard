import { authLogout, updateReferenceDocumentCountDetails, updateReferenceDocumentCountLoading, enqueueNotification } from 'stores';
import * as utils from 'utils';

export const getRiskReferenceDocumentsCount = (riskReferenceList, documentTypeValue) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}} = getState();

  const defaultError = { file: 'stores/processingInstructions.actions.getRiskReferenceDocumentsCount' };

  dispatch(updateReferenceDocumentCountLoading(true));
  dispatch(getRiskReferenceDocumentsCountRequest(riskReferenceList));
  const requestObject = {
    riskReferenceList: riskReferenceList,
    documentType: documentTypeValue,
  };
  return utils.api
    .post({
      token: auth.accessToken,
      endpoint: endpoint.dmsService,
      path: 'data/validateDocs/riskReferencesDocumentCountDetails',
      data: requestObject,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleNewData(json))
    .then((data) => {
      dispatch(getRiskReferenceDocumentsCountSuccess(data.data));
      dispatch(updateReferenceDocumentCountDetails(data.data));
      return data;
    })
    .catch((err) => {
      utils.api.handleError(err, { ...defaultError, message: 'API fetch error (processingInstructions.getRiskReferenceDocumentsCount)' });
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(getRiskReferenceDocumentsCountFailure(err));
      dispatch(enqueueNotification('app.somethingWentWrong', 'warning'));
      return err;
    })
    .finally(() => {
      dispatch(updateReferenceDocumentCountLoading(false));
    });
};

export const getRiskReferenceDocumentsCountRequest = (id) => {
  return {
    type: 'RISK_REFERENCE_DOCUMENTS_COUNT_REQUEST',
    payload: id,
  };
};

export const getRiskReferenceDocumentsCountSuccess = (data) => {
  return {
    type: 'RISK_REFERENCE_DOCUMENTS_COUNT_SUCCESS',
    payload: data,
  };
};

export const getRiskReferenceDocumentsCountFailure = (error) => {
  return {
    type: 'RISK_REFERENCE_DOCUMENTS_COUNT_FAILURE',
    payload: error,
  };
};
