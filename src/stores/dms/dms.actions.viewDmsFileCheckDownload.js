// This is a standalone file just to check if a file is downloadable or not before trying to view Ms office files

// app
import { addLoader, removeLoader, enqueueNotification } from 'stores';
import * as utils from 'utils';

export const viewDmsFileCheckDownload = (doc) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint } }} = getState();

  const { documentId, documentName } = doc;

  dispatch(addLoader('viewDmsFileCheckDownload'));

  if (!documentId || !documentName) {
    dispatch(enqueueNotification('Missing or invalid params', 'error'));
    return false;
  }

  return utils.api
    .get({
      token: auth.accessToken,
      endpoint: endpoint.dmsService,
      path: `dms/document/download/${documentId}`,
    })
    .then((response) => {
      if (!response.ok) {
        return false;
      } else {
        return response.blob();
      }
    })
    .then((blob) => blob && documentName)
    .catch(() => false)
    .finally((result) => {
      dispatch(removeLoader('viewDmsFileCheckDownload'));
      return result;
    });
};
