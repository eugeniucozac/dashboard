import { authLogout, addLoader, removeLoader } from 'stores';
import * as utils from 'utils';

export const downloadWhitespaceZip = (umrIds) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}} = getState();

  const defaultError = {
    file: 'stores/whitespace.actions.downloadWhitespaceZip',
  };

  dispatch(downloadWhitespaceZipRequest(umrIds));
  dispatch(addLoader('downloadWhitespaceZip'));

  if (!utils.generic.isValidArray(umrIds, true)) {
    dispatch(downloadWhitespaceZipFailure(defaultError));
    dispatch(removeLoader('downloadWhitespaceZip'));
  }

  return utils.api
    .get({
      token: auth.accessToken,
      endpoint: endpoint.whitespace,
      path: `api/v1/mrcContracts/pdf?umrId=${umrIds.join(',')}`,
    })
    .then((response) => utils.api.handleResponseBlob(response))
    .then((blob) => {
      dispatch(downloadWhitespaceZipSuccess());
      return blob;
    })
    .catch((err) => {
      utils.api.handleError(err, defaultError);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(downloadWhitespaceZipFailure(err));
      return false;
    })
    .finally(() => {
      dispatch(removeLoader('downloadWhitespaceZip'));
    });
};

export const downloadWhitespaceZipRequest = (payload) => {
  return {
    type: 'WHITESPACE_ZIP_DOWNLOAD_REQUEST',
    payload,
  };
};

export const downloadWhitespaceZipSuccess = () => {
  return {
    type: 'WHITESPACE_ZIP_DOWNLOAD_SUCCESS',
  };
};

export const downloadWhitespaceZipFailure = (error) => {
  return {
    type: 'WHITESPACE_ZIP_DOWNLOAD_FAILURE',
    payload: error,
  };
};
