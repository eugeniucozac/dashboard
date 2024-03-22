import { addLoader, authLogout, enqueueNotification, hideModal, removeLoader } from 'stores';
import * as utils from 'utils';

export const deleteReportGroupDoc = (reportGroupId) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint } } } = getState();

  const defaultError = {
    file: 'stores/reporting.action.deleteReportGroupDoc',
    message: 'Data missing for DELETE request',
  };

  dispatch(deleteReportGroupDocRequest(reportGroupId));
  dispatch(addLoader('deleteReportGroupDoc'));

  if (!reportGroupId) {
    dispatch(deleteReportGroupDocFailure(defaultError));

    dispatch(enqueueNotification('notification.reporting.deleteReport.fail', 'error'));
    dispatch(hideModal());
    dispatch(removeLoader('deleteReportGroupDoc'));
    return;
  }

  return utils.api
    .delete({
      token: auth.accessToken,
      endpoint: endpoint.document,
      path: `api/report-group/${reportGroupId}`,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleData(json))
    .then(() => {
      dispatch(enqueueNotification('notification.reporting.deleteReport.success', 'success'));
      dispatch(removeLoader('deleteReportGroupDoc'));
    })
    .catch((err) => {
      const errorParams = {
        ...defaultError,
        message: 'API delete error (reporting.deleteReportGroupDoc)',
      };

      utils.api.handleError(err, errorParams);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(deleteReportGroupDocFailure(err));
      dispatch(enqueueNotification('notification.reporting.deleteReport.fail', 'error'));
      dispatch(removeLoader('deleteReportGroupDoc'));
      return err;
    });
};

export const deleteReportGroupDocRequest = (data) => {
  return {
    type: 'REPORT_GROUP_DOC_DELETE_REQUEST',
    payload: data,
  };
};

export const deleteReportGroupDocFailure = (error) => {
  return {
    type: 'REPORT_GROUP_DOC_DELETE_FAILURE',
    payload: error,
  };
};
