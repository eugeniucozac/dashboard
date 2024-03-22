import { addLoader, authLogout, enqueueNotification, hideModal, removeLoader } from 'stores';
import * as utils from 'utils';

export const deleteReport = (reportId) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}} = getState();

  const defaultError = {
    file: 'stores/reporting.action.deleteReport',
    message: 'Data missing for DELETE request',
  };

  dispatch(deleteReportRequest(reportId));
  dispatch(addLoader('deleteReport'));

  if (!reportId) {
    dispatch(deleteReportFailure(defaultError));
    dispatch(enqueueNotification('notification.reporting.deleteReportGroup.fail', 'error'));
    dispatch(removeLoader('deleteReport'));
    return;
  }

  return utils.api
    .delete({
      token: auth.accessToken,
      endpoint: endpoint.edge,
      path: `api/report/${reportId}`,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleData(json))
    .then(() => {
      dispatch(deleteReportSuccess(reportId));
      dispatch(enqueueNotification('notification.reporting.deleteReportGroup.success', 'success'));
      dispatch(hideModal());
      dispatch(removeLoader('deleteReport'));
    })
    .catch((err) => {
      const errorParams = {
        ...defaultError,
        message: 'API delete error (reporting.deleteReport)',
      };

      utils.api.handleError(err, errorParams);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(deleteReportFailure(err));
      dispatch(enqueueNotification('notification.reporting.deleteReportGroup.fail', 'error'));
      dispatch(hideModal());
      dispatch(removeLoader('deleteReport'));
      return err;
    });
};

export const deleteReportRequest = (data) => {
  return {
    type: 'REPORT_DELETE_REQUEST',
    payload: data,
  };
};

export const deleteReportSuccess = (data) => {
  return {
    type: 'REPORT_DELETE_SUCCESS',
    payload: data,
  };
};

export const deleteReportFailure = (error) => {
  return {
    type: 'REPORT_DELETE_FAILURE',
    payload: error,
  };
};
