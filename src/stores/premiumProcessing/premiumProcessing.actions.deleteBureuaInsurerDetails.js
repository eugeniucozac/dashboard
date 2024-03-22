import { removeLoader, addLoader, enqueueNotification, authLogout } from 'stores';
import * as utils from 'utils';

export const deleteBureauInsurerDetails = (caseIncidentIssueDocsId) => (dispatch, getState) => {
  const {
    user: { auth },
    config: {
      vars: { endpoint },
    },
  } = getState();

  const defaultError = {
    file: 'stores/premiumProcessing.actions.deleteBureauInsurerDetails',
  };
  dispatch(deleteBureauInsurerDetailsRequest(caseIncidentIssueDocsId));
  dispatch(addLoader('deleteBureauInsurerDetails'));

  if (!caseIncidentIssueDocsId) {
    dispatch(deleteBureauInsurerDetailsFailure({ ...defaultError, message: 'Missing parameters' }));
    dispatch(enqueueNotification('notification.submission.fail', 'error'));
    dispatch(removeLoader('deleteBureauInsurerDetails'));
    return;
  }

  const path = `issueDocs/deleteIssueDocsDetails/${caseIncidentIssueDocsId}`;

  return utils.api
    .delete({
      token: auth.accessToken,
      endpoint: endpoint.bpmService,
      path,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleNewData(json))
    .then((data) => {
      dispatch(deleteBureauInsurerDetailsSuccess(caseIncidentIssueDocsId));
      return data;
    })
    .catch((error) => {
      utils.api.handleError(error, { ...defaultError, message: 'API fetch error (premiumProcessing.deleteBureauInsurerDetails)' });
      utils.api.handleUnauthorized(error, dispatch, authLogout);
      dispatch(
        deleteBureauInsurerDetailsFailure(error, {
          file: 'stores/premiumProcessing.actions.deleteBureauInsurerDetails',
        })
      );
      dispatch(enqueueNotification('premiumProcessing.bureauColumns.apiDeleteFail', 'error'));
      return error;
    })
    .finally(() => {
      dispatch(removeLoader('deleteBureauInsurerDetails'));
    });
};

export const deleteBureauInsurerDetailsRequest = (caseIncidentIssueDocsId) => {
  return {
    type: 'PREMIUM_PROCESSING_BUREAU_INSURER_DETAILS_DELETE_REQUEST',
    payload: caseIncidentIssueDocsId,
  };
};

export const deleteBureauInsurerDetailsSuccess = (data) => {
  return {
    type: 'PREMIUM_PROCESSING_BUREAU_INSURER_DETAILS_DELETE_SUCCESS',
    payload: data,
  };
};

export const deleteBureauInsurerDetailsFailure = (error) => {
  return {
    type: 'PREMIUM_PROCESSING_BUREAU_INSURER_DETAILS_DELETE_FAILURE',
    payload: error,
  };
};
