import { addLoader, authLogout, removeLoader, enqueueNotification } from 'stores';
import * as utils from 'utils';

export const linkDmsDocument = (params) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}} = getState();

  const defaultError = {
    file: 'stores/dms.actions.linkDmsDocument',
  };

  const { documentId, referenceId, sectionType } = params;

  dispatch(linkDmsDocumentRequest(params));
  dispatch(addLoader('linkDmsDocument'));

  if (!documentId || !referenceId || !sectionType) {
    dispatch(linkDmsDocumentFailure({ ...defaultError, message: 'Missing params' }));
    dispatch(removeLoader('linkDmsDocument'));
    return;
  }

  // This list will be changed once we have multi-select functionality till then it's gonna be a single document to unlink
  const apiParams = [
    {
      documentId: documentId,
      referenceId: referenceId,
      sectionType: sectionType,
    },
  ];

  return utils.api
    .post({
      token: auth.accessToken,
      endpoint: endpoint.dmsService,
      path: 'dms/documet/link',
      data: apiParams,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleNewData(json))
    .then((data) => {
      dispatch(enqueueNotification('dms.search.notifications.successLink', 'success'));
      dispatch(linkDmsDocumentSuccess(data));
      return data;
    })
    .catch((err) => {
      dispatch(enqueueNotification('dms.search.notifications.failedLink', 'error'));
      utils.api.handleError(err, defaultError);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(linkDmsDocumentFailure(err));
      return err;
    })
    .finally(() => {
      dispatch(removeLoader('linkDmsDocument'));
    });
};

export const linkDmsDocumentRequest = (data) => {
  return {
    type: 'DMS_LINK_SEARCH_DOCUMENTS_REQUEST',
    payload: data,
  };
};

export const linkDmsDocumentSuccess = (data) => {
  return {
    type: 'DMS_LINK_SEARCH_DOCUMENTS_SUCCESS',
    payload: data,
  };
};

export const linkDmsDocumentFailure = (error) => {
  return {
    type: 'DMS_LINK_SEARCH_DOCUMENTS_FAILURE',
    payload: error,
  };
};
