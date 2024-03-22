// app
import { addLoader, authLogout, removeLoader } from 'stores';
import * as utils from 'utils';

export const downloadDocument = (doc) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}} = getState();
  const { id, fileName } = doc;

  dispatch(addLoader({ key: 'downloadDocument', message: doc.fileName }));

  utils.api
    .get({
      token: auth.accessToken,
      endpoint: endpoint.document,
      path: `api/document/download/${id}`,
    })
    .then((response) => response.blob())
    .then((blob) => utils.file.download(blob, fileName))
    .catch((err) => {
      const errorParams = {
        file: 'stores/document.actions',
        message: 'API fetch error (document)',
      };
      utils.api.handleError(err, errorParams);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
    })
    .finally(() => {
      dispatch(removeLoader('downloadDocument'));
    });
};
