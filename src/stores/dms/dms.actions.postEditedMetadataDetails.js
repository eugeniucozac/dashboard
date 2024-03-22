import { addLoader, removeLoader, enqueueNotification, authLogout } from 'stores';
import * as utils from 'utils';

export const postEditedMetadataDetails = (payload) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint } } } = getState();

  const defaultError = {
    file: 'stores/dms.actions.postEditedMetadataDetails',
  };

  dispatch(postEditedMetadataDetailsRequest(payload));
  dispatch(addLoader('postEditedMetadataDetails'));

  return utils.api
    .put({
      token: auth.accessToken,
      endpoint: endpoint.dmsService,
      path: 'data/document/update/metadata',
      data: payload,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleNewData(json))
    .then((data) => {
      dispatch(postEditedMetadataDetailsSuccess(data));
      dispatch(enqueueNotification(utils.string.t('dms.metadata.notifications.editMetadataSuccess'), 'success'));
      return data;
    })
    .catch((error) => {
      dispatch(postEditedMetadataDetailsFailure(error, defaultError));
      dispatch(enqueueNotification(utils.string.t('dms.metadata.notifications.editMetadataFailure'), 'error'));
      utils.api.handleUnauthorized(error, dispatch, authLogout);
      return error;
    })
    .finally(() => {
      dispatch(removeLoader('postEditedMetadataDetails'));
    });
};

export const postEditedMetadataDetailsRequest = (data) => {
  return {
    type: 'DMS_META_DATA_POST_REQUEST',
    payload: data,
  };
};

export const postEditedMetadataDetailsSuccess = (data) => {
  return {
    type: 'DMS_META_DATA_POST_SUCCESS',
    payload: data,
  };
};

export const postEditedMetadataDetailsFailure = (error) => {
  return {
    type: 'DMS_META_DATA_TASK_POST_FAILURE',
    payload: error,
  };
};
