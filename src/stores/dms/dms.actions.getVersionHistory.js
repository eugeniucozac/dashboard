import { addLoader, removeLoader, authLogout } from 'stores';
import * as utils from 'utils';

import types from './types';

export const getdmsVersionHistory = (documentId) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint } } } = getState();

  const defaultError = {
    file: 'stores/claims.actions.getVersionHistory',
  };
  const params = { documentId: documentId };

  dispatch(getVersionHistoryRequest(params));
  dispatch(addLoader('getVersionHistory'));

  return utils.api
    .get({
      token: auth.accessToken,
      endpoint: endpoint.dmsService,
      path: 'dms/version/history',
      params,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((data) => {
      dispatch(getVersionHistorySuccess(data));
      return data;
    })
    .catch((err) => {
      dispatch(getVersionHistoryFailure(err, defaultError));
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      return err;
    })
    .finally(() => {
      dispatch(removeLoader('getVersionHistory'));
    });
};

export const getVersionHistoryRequest = (params) => {
  return {
    type: types.GET_DMS_VERSION_HISTORY_PENDING,
    payload: params,
  };
};

export const getVersionHistorySuccess = (data) => {
  return {
    type: types.GET_DMS_VERSION_HISTORY_SUCCESS,
    payload: {
      items: data,
    },
  };
};

export const getVersionHistoryFailure = (error) => {
  return {
    type: types.GET_DMS_VERSION_HISTORY_REJECTED,
    payload: error,
  };
};
