//app
import { authLogout, addLoader, removeLoader, enqueueNotification } from 'stores';
import * as utils from 'utils';

export const getDmsEditMetadata = (documentId, documentClassificationId) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint } } } = getState();

  const defaultError = {
    file: 'stores/claims.actions.getDmsEditMetadata',
  };

  dispatch(getDmsEditMetadataRequest({ documentClassificationId: documentClassificationId }));
  dispatch(addLoader('getDmsEditMetadata'));

  return utils.api
    .get({
      token: auth.accessToken,
      endpoint: endpoint.dmsService,
      path: `data/document/${documentId}/getMetadata`,
      params: { documentClassificationId: documentClassificationId },
    })
    .then((response) => utils.api.handleResponse(response))
    .then((response) => utils.api.handleNewData(response))
    .then((data) => {
      dispatch(enqueueNotification('dms.metadata.notifications.getMetadataSuccess', 'success'));
      dispatch(getDmsEditMetadataSuccess(data?.data || {}));
      return data;
    })
    .catch((err) => {
      dispatch(enqueueNotification('dms.metadata.notifications.getMetadataFailure', 'error'));
      dispatch(getDmsEditMetadataFailure(err, defaultError));
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      return err;
    })
    .finally(() => {
      dispatch(removeLoader('getDmsEditMetadata'));
    });
};

export const getDmsEditMetadataRequest = (params) => {
  return {
    type: 'GET_EDIT_DMS_META_DATA_PENDING',
    payload: params,
  };
};

export const getDmsEditMetadataSuccess = (data) => {
  return {
    type: 'GET_EDIT_DMS_META_DATA_SUCCESS',
    payload: data,
  };
};

export const getDmsEditMetadataFailure = (error) => {
  return {
    type: 'GET_EDIT_DMS_META_DATA_REJECTED',
    payload: error,
  };
};
