import { authLogout } from 'stores';
import * as utils from 'utils';

export const getFilesList = (umrId) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}} = getState();

  const defaultError = {
    file: 'stores/whitespace.actions.getFilesList',
  };

  dispatch(getFilesListRequest(umrId));

  return utils.api
    .get({
      token: auth.accessToken,
      endpoint: endpoint.whitespace,
      path: `api/v1/mrcContracts?exists=true&umrId=${umrId}`,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((data) => {
      dispatch(getFilesListSuccess(data));
      return data;
    })
    .catch((err) => {
      utils.api.handleError(err, defaultError);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(getFilesListFailure(err));
      return err;
    });
};

export const getFilesListRequest = (umrIds) => {
  return {
    type: 'FILES_LIST_GET_REQUEST',
    payload: umrIds,
  };
};

export const getFilesListSuccess = (payload) => {
  return {
    type: 'FILES_LIST_GET_SUCCESS',
    payload,
  };
};

export const getFilesListFailure = (error) => {
  return {
    type: 'FILES_LIST_GET_FAILURE',
    payload: error,
  };
};
