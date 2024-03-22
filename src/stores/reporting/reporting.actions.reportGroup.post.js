// app
import { authLogout, enqueueNotification, addLoader, removeLoader, hideModal } from 'stores';
import * as utils from 'utils';

export const createReportingGroup = (payload) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}} = getState();

  const defaultError = {
    file: 'stores/reporting.actions.post',
    message: 'Data missing for POST request',
  };

  dispatch(postReportingGroupRequest(payload));
  dispatch(addLoader('createReportingGroup'));

  if (!payload || typeof payload !== 'object') {
    dispatch(postReportingGroupFailure(defaultError));
    dispatch(enqueueNotification('notification.reporting.postFail', 'error'));
    dispatch(hideModal());
    dispatch(removeLoader('createReportingGroup'));
    return;
  }
  const data = payload;

  return utils.api
    .post({
      token: auth.accessToken,
      endpoint: endpoint.edge,
      path: 'api/reportgroup',
      data: data,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleData(json))
    .then((data) => {
      dispatch(postReportingGroupSuccess(data));
      dispatch(hideModal());
      dispatch(enqueueNotification('notification.reporting.postSuccess', 'success'));
    })
    .catch((err) => {
      const errorParams = {
        ...defaultError,
        message: 'API post error (report group)',
      };

      utils.api.handleError(err, errorParams);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(postReportingGroupFailure(err));
      dispatch(enqueueNotification('notification.reporting.postFail', 'error'));
      return err;
    })
    .finally(() => {
      dispatch(removeLoader('createReportingGroup'));
    });
};

export const postReportingGroupRequest = (payload) => {
  return {
    type: 'REPORTING_GROUP_POST_REQUEST',
    payload,
  };
};

export const postReportingGroupSuccess = (payload) => {
  return {
    type: 'REPORTING_GROUP_POST_SUCCESS',
    payload,
  };
};

export const postReportingGroupFailure = (error) => {
  return {
    type: 'REPORTING_GROUP_POST_FAILURE',
    payload: error,
  };
};
