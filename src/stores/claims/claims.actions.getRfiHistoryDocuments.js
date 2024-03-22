import * as utils from 'utils';
import { authLogout } from 'stores';
import get from 'lodash/get';

export const getRfiHistoryDocuments = (params) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint } }, claims } = getState();

  const { caseIncidentNotesList, taskId } = params;

  const defaultError = {
    file: 'stores/claims.actions.getRfiHistoryDocuments',
  };
  dispatch(getRfiHistoryDocumentsRequest());
  const rfiHistoryList = get(claims, 'rfiHistory');

  const apiParams = caseIncidentNotesList;

  return utils.api
    .post({
      token: auth.accessToken,
      endpoint: endpoint.dmsService,
      path: `dms/document/list?srcApplication=BOTH`,
      data: apiParams,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleNewData(json))
    .then((data) => {
      if (data?.data) {
        const docList = [...data?.data];
        const docMap = new Map();
        docList?.forEach((doc) => {
          const docRef = doc?.referenceId;
          const notesId = docRef?.replace(`${taskId}-`, '');
          if (!docMap.has(parseInt(notesId))) {
            docMap.set(parseInt(notesId), [doc]);
          } else {
            const list = docMap.get(parseInt(notesId));
            list.push(doc);
            docMap.set(parseInt(notesId), list);
          }
        });

        const rfiHistoryDetails = { ...rfiHistoryList };
        const rfiHistoryDocList = rfiHistoryDetails?.data?.map((item) => {
          const rfiHistory = { ...item };
          const documentList = docMap.get(rfiHistory?.caseIncidentNotesID);
          rfiHistory.documentList = documentList;
          return rfiHistory;
        });
        dispatch(getRfiHistoryDocumentsSuccess({ documentList: rfiHistoryDocList }));
      }
      return data;
    })
    .catch((error) => {
      dispatch(getRfiHistoryDocumentsFailure(error, defaultError));
      utils.api.handleUnauthorized(error, dispatch, authLogout);
      return error;
    });
};

export const getRfiHistoryDocumentsRequest = (payload) => {
  return {
    type: 'CLAIMS_GET_RFI_HISTORY_DOCUMENTS_REQUEST',
    payload,
  };
};

export const getRfiHistoryDocumentsSuccess = (data) => {
  return {
    type: 'CLAIMS_GET_RFI_HISTORY_DOCUMENTS_SUCCESS',
    payload: data,
  };
};

export const getRfiHistoryDocumentsFailure = (error) => {
  return {
    type: 'CLAIMS_GET_RFI_HISTORY_DOCUMENTS_FAILURE',
    payload: error,
  };
};
