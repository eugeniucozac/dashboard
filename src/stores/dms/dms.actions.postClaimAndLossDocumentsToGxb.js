import * as utils from 'utils';
import { enqueueNotification, authLogout } from 'stores';
import get from 'lodash/get';

export const postClaimAndLossDocumentsToGxb = (params) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint } }, claims } = getState();
  // prettier-ignore
  const { referenceId, sectionType, documents } = params;

  const lossDocuments = get(claims, 'dmsDocDetails.manageDocument.lossDocumentDetails') || [];
  const claimDocuments = get(claims, 'dmsDocDetails.manageDocument.claimDocumentDetails') || [];

  const ViewDocuments = [...lossDocuments, ...claimDocuments];

  const checkedDocuments = Object.keys(Object.fromEntries(Object.entries(documents).filter(([key, value]) => value)));

  let gxbDocuments = [];

  ViewDocuments?.forEach((item) => {
    gxbDocuments.push({
      documentId: item.documentId,
      isSentToGxb: checkedDocuments.includes(item.documentId.toString()) ? 1 : 0,
      referenceId: referenceId,
      sectionType: sectionType,
    });
  });

  dispatch(postClaimsAndLossDocumentsToGxbRequest(gxbDocuments));

  return utils.api
    .put({
      token: auth.accessToken,
      endpoint: endpoint.dmsService,
      path: 'dms/document/gxbContext',
      data: gxbDocuments,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleNewData(json))
    .then((data) => {
      dispatch(enqueueNotification(data?.message, 'success'));
      dispatch(postClaimsAndLossDocumentsToGxSuccess(data?.data));
      return data;
    })

    .catch((err) => {
      const defaultError = {
        file: 'stores/dms.actions.postDmsDocuments',
      };
      dispatch(enqueueNotification('notification.uploadDmsFile.fail', 'error'));
      utils.api.handleError(err, defaultError);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      return dispatch(postClaimsAndLossDocumentsToGxFailure(err));
    });
};

export const postClaimsAndLossDocumentsToGxbRequest = (params) => {
  return {
    type: 'DMS_POST_CLAIM_AND_LOSS_DOCUMENTS_REQUEST',
    payload: params,
  };
};

export const postClaimsAndLossDocumentsToGxSuccess = (data) => {
  return {
    type: 'DMS_POST_CLAIM_AND_LOSS_DOCUMENTS_SUCCESS',
    payload: data,
  };
};

export const postClaimsAndLossDocumentsToGxFailure = (err) => {
  return {
    type: 'DMS_POST_CLAIM_AND_LOSS_DOCUMENTS_ERROR',
    payload: err,
  };
};
