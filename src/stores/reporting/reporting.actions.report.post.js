// app
import { authLogout, enqueueNotification, addLoader, removeLoader, hideModal } from 'stores';
import * as utils from 'utils';

export const createReport = (payload) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint } } } = getState();

  const defaultError = {
    file: 'stores/reporting.actions.group.post',
    message: 'Data missing for POST request',
  };

  dispatch(postReportRequest(payload));
  dispatch(addLoader('createReport'));

  if (!payload || typeof payload !== 'object') {
    dispatch(postReportFailure(defaultError));
    dispatch(enqueueNotification('notification.reporting.postReportGroup.postFail', 'error'));
    dispatch(hideModal());
    dispatch(removeLoader('createReport'));
    return;
  }
  const data = {
    title: payload.report,
    description: payload.description,
    powerbiReportId: payload.reportId,
    reportgroupId: payload.reportgroupId,
  };

  return utils.api
    .post({
      token: auth.accessToken,
      endpoint: endpoint.edge,
      path: 'api/report',
      data,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleData(json))
    .then((data) => {
      dispatch(postReportSuccess(data));
      dispatch(hideModal());
      dispatch(enqueueNotification('notification.reporting.postReportGroup.postSuccess', 'success'));
    })
    .catch((err) => {
      const errorParams = {
        ...defaultError,
        message: 'API post error (report)',
      };

      utils.api.handleError(err, errorParams);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(postReportFailure(err));
      dispatch(enqueueNotification('notification.reporting.postReportGroup.postFail', 'error'));
      return err;
    })
    .finally(() => {
      dispatch(removeLoader('createReport'));
    });
};

export const postReportRequest = (payload) => {
  return {
    type: 'REPORT_POST_REQUEST',
    payload,
  };
};

export const postReportSuccess = (payload) => {
  return {
    type: 'REPORT_POST_SUCCESS',
    payload,
  };
};

export const postReportFailure = (error) => {
  return {
    type: 'REPORT_POST_FAILURE',
    payload: error,
  };
};
