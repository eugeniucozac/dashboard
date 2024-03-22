import { addLoader, authLogout, enqueueNotification, removeLoader, postQuoteResponseSuccess } from 'stores';
import * as utils from 'utils';

export const requestDismissIssues = (quote) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}} = getState();
  const quoteId = quote.id;

  const defaultError = {
    file: 'stores/risk.actions.requestDismissIssues',
    message: 'Data missing for POST request',
  };

  dispatch(requestDismissIssuesRequest(quoteId));
  dispatch(addLoader('requestDismissIssues'));

  if (!quoteId) {
    dispatch(requestDismissIssuesFailure(defaultError));
    dispatch(enqueueNotification('notification.generic.request', 'error'));
    dispatch(removeLoader('requestDismissIssues'));
    return;
  }

  const path = `api/v1/quotes/${quoteId}/request-to-dismiss-issues`;

  return utils.api
    .put({
      token: auth.accessToken,
      endpoint: endpoint.auth,
      path,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleResponseJsonObject(json))
    .then((data) => {
      dispatch(postQuoteResponseSuccess(data));
      return data;
    })
    .then(() => {
      dispatch(enqueueNotification('notification.requestDismissIssues.success', 'success'));
    })
    .catch((err) => {
      const errorParams = {
        ...defaultError,
        message: 'API post error (risk.requestDismissIssues)',
      };

      utils.api.handleError(err, errorParams);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(requestDismissIssuesFailure(err));
      dispatch(enqueueNotification(utils.api.getErrorMessage(err), 'error'));
      return err;
    })
    .finally(() => {
      dispatch(removeLoader('requestDismissIssues'));
      return;
    });
};

export const requestDismissIssuesRequest = (formData) => {
  return {
    type: 'RISK_DISMISS_ISSUES_REQUEST',
    payload: formData,
  };
};

export const requestDismissIssuesFailure = (error) => {
  return {
    type: 'RISK_DISMISS_ISSUES_FAILURE',
    payload: error,
  };
};
