import { authLogout, enqueueNotification } from 'stores';
import * as utils from 'utils';

export const updateIssue = (issueId, status, quoteId) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint } } } = getState();
  const defaultError = {
    file: 'stores/risk.actions.issues',
    message: 'Data missing for PUT request',
  };

  dispatch(updateIssueRequest(status));

  if (!status || !issueId || !quoteId) {
    dispatch(updateIssueFailure(defaultError));
    dispatch(enqueueNotification('notification.generic.request', 'error'));
    return;
  }

  const path = `api/v1/issues/${issueId}/${status}`;

  return utils.api
    .put({
      token: auth.accessToken,
      endpoint: endpoint.auth,
      path,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleResponseJsonObject(json))
    .then((data) => {
      dispatch(enqueueNotification('notification.updateIssue.success', 'success'));
      dispatch(updateIssueSuccess(data, quoteId));
      return data;
    })
    .catch((err) => {
      const errorParams = {
        ...defaultError,
        message: 'API post error (risk.updateIssue)',
      };

      utils.api.handleError(err, errorParams);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(updateIssueFailure(err));
      dispatch(enqueueNotification(utils.api.getErrorMessage(err), 'error'));
      return err;
    });
};

export const updateIssueRequest = (formData) => {
  return {
    type: 'UPDATE_ISSUE_REQUEST',
    payload: formData,
  };
};

export const updateIssueSuccess = (responseData, quoteId) => {
  return {
    type: 'UPDATE_ISSUE_SUCCESS',
    payload: responseData,
    quoteId,
  };
};

export const updateIssueFailure = (error) => {
  return {
    type: 'UPDATE_ISSUE_FAILURE',
    payload: error,
  };
};
