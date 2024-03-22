import { addLoader, authLogout, removeLoader } from 'stores';
import * as utils from 'utils';

export const getReportingDcouments = (reportGroupId) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint } } } = getState();

  const defaultError = {
    file: 'stores/reporting.actions.getReportingDcouments',
  };

  dispatch(getReportDocsRequest(reportGroupId));
  dispatch(addLoader('getReportingDcouments'));

  if (!reportGroupId) {
    dispatch(getReportDocsFailure(defaultError));
    dispatch(removeLoader('getReportingDcouments'));
    return;
  }
  return utils.api
    .get({
      token: auth.accessToken,
      endpoint: endpoint.document,
      path: `api/document/report-group/${reportGroupId}`,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleData(json))
    .then((data) => {
      dispatch({ type: 'DOCUMENT_SET_FOLDER_STRUCTURE_REPORTING', payload: data?.map((d) => d?.reportGroupFolder) });
      dispatch({ type: 'DOCUMENTS_SET_FOR_PLACEMENT', payload: data });
    })
    .catch((err) => {
      utils.api.handleError(err, defaultError);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(getReportDocsFailure(err));
      return err;
    })
    .finally(() => {
      dispatch(removeLoader('getReportingDcouments'));
    });
};

export const getReportDocsRequest = (payload) => {
  return {
    type: 'REPORTING_DOCS_GET_REQUEST',
    payload,
  };
};

export const getReportDocsFailure = (error) => {
  return {
    type: 'REPORTING_DOCS_GET_FAILURE',
    payload: error,
  };
};
