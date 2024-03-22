import { authLogout, addLoader, removeLoader } from 'stores';
import * as utils from 'utils';

export const downloadWhitespacePdf = (umrId) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}} = getState();

  const defaultError = {
    file: 'stores/whitespace.actions.downloadWhitespacePdf',
  };

  dispatch(downloadWhitespacePdfRequest(umrId));
  dispatch(addLoader('downloadWhitespacePdf'));

  if (!umrId) {
    dispatch(downloadWhitespacePdfFailure(defaultError));
    dispatch(removeLoader('downloadWhitespacePdf'));
  }

  return utils.api
    .get({
      token: auth.accessToken,
      endpoint: endpoint.whitespace,
      path: `api/v1/mrcContracts/pdf/${umrId}`,
    })
    .then((response) => utils.api.handleResponseBlob(response))
    .then((blob) => {
      dispatch(downloadWhitespacePdfSuccess());
      return blob;
    })
    .catch((err) => {
      utils.api.handleError(err, defaultError);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(downloadWhitespacePdfFailure(err));
      return false;
    })
    .finally(() => {
      dispatch(removeLoader('downloadWhitespacePdf'));
    });
};

export const downloadWhitespacePdfRequest = (payload) => {
  return {
    type: 'WHITESPACE_PDF_DOWNLOAD_REQUEST',
    payload,
  };
};

export const downloadWhitespacePdfSuccess = () => {
  return {
    type: 'WHITESPACE_PDF_DOWNLOAD_SUCCESS',
  };
};

export const downloadWhitespacePdfFailure = (error) => {
  return {
    type: 'WHITESPACE_PDF_DOWNLOAD_FAILURE',
    payload: error,
  };
};
