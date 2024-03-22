import { addLoader, authLogout, removeLoader, enqueueNotification } from 'stores';
import * as utils from 'utils';

export const linkMultipleDmsDocuments = (params) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint } } } = getState();

  const defaultError = {
    file: 'stores/dms.actions.linkMultipleDmsDocuments',
  };

  dispatch(linkDmsDocumentsRequest(params));
  dispatch(addLoader('linkMultipleDmsDocuments'));

  if (!params) {
    dispatch(linkDmsDocumentsFailure({ ...defaultError, message: 'Missing params' }));
    dispatch(removeLoader('linkMultipleDmsDocuments'));
    return;
  }

  return utils.api
    .post({
      token: auth.accessToken,
      endpoint: endpoint.dmsService,
      path: 'dms/documet/link',
      data: params,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleNewData(json))
    .then((data) => {
      dispatch(enqueueNotification('dms.search.notifications.successLink', 'success'));
      dispatch(linkDmsDocumentsSuccess(data));
      return data;
    })
    .catch((err) => {
      dispatch(enqueueNotification('dms.search.notifications.failedLink', 'error'));
      utils.api.handleError(err, defaultError);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(linkDmsDocumentsFailure(err));
      return err;
    })
    .finally(() => {
      dispatch(removeLoader('linkMultipleDmsDocuments'));
    });
};

export const linkDmsDocumentsRequest = (data) => {
  return {
    type: 'DMS_LINK_MULTIPLE_DOCUMENTS_REQUEST',
    payload: data,
  };
};

export const linkDmsDocumentsSuccess = (data) => {
  return {
    type: 'DMS_LINK_MULTIPLE_DOCUMENTS_SUCCESS',
    payload: data,
  };
};

export const linkDmsDocumentsFailure = (error) => {
  return {
    type: 'DMS_LINK_MULTIPLE_DOCUMENTS_FAILURE',
    payload: error,
  };
};
