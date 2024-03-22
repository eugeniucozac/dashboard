import { authLogout, enqueueNotification, addLoader, removeLoader } from 'stores';
import * as utils from 'utils';

export const postOpeningMemoPDF = (openingMemoId, pdfOutput) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}} = getState();

  const defaultError = {
    file: 'stores/openingMemo.actions.postPDF',
  };

  dispatch(postOpeningMemoPDFRequest({ openingMemoId, pdfOutput }));
  dispatch(addLoader('postOpeningMemoPDF'));

  if (!openingMemoId || !pdfOutput) {
    dispatch(postOpeningMemoPDFFailure({ ...defaultError, message: 'Data missing for multi-part POST request' }));
    dispatch(enqueueNotification('notification.openingMemo.postPdfFail', 'error'));
    dispatch(removeLoader('postOpeningMemoPDF'));
    return;
  }

  const form = new FormData();
  const newFile = new File([pdfOutput], `opening-memo-${openingMemoId}}.pdf`, {
    type: 'application/pdf',
    lastModified: new Date(),
  });

  form.append('file', newFile);

  return utils.api
    .multiPartPost({
      token: auth.accessToken,
      endpoint: endpoint.edge,
      path: `api/openingMemo/${openingMemoId}/documents/attachFile`,
      data: form,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleData(json))
    .then((data) => {
      dispatch(postOpeningMemoPDFSuccess(data));
      dispatch(enqueueNotification('notification.openingMemo.postPdfSuccess', 'success'));
    })
    .catch((err) => {
      const errorParams = {
        ...defaultError,
        message: 'API multi-part POST error (postOpeningMemoPDF)',
      };

      utils.api.handleError(err, errorParams);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(postOpeningMemoPDFFailure(err));
      dispatch(enqueueNotification('notification.openingMemo.postPdfFail', 'error'));
      return err;
    })
    .finally(() => {
      dispatch(removeLoader('postOpeningMemoPDF'));
    });
};

export const postOpeningMemoPDFRequest = (payload) => {
  return {
    type: 'OPENING_MEMO_PDF_POST_REQUEST',
    payload,
  };
};

export const postOpeningMemoPDFSuccess = (payload) => {
  return {
    type: 'OPENING_MEMO_PDF_POST_SUCCESS',
    payload,
  };
};

export const postOpeningMemoPDFFailure = (error) => {
  return {
    type: 'OPENING_MEMO_PDF_POST_FAILURE',
    payload: error,
  };
};
