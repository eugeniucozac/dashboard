import { addLoader, authLogout, enqueueNotification, hideModal, removeLoader } from 'stores';
import * as utils from 'utils';

export const deleteReportGroup = (reportGroupId) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}} = getState();

  const defaultError = {
    file: 'stores/reporting.action.deleteReportGroup',
    message: 'Data missing for DELETE request',
  };

  dispatch(deleteReportGroupRequest(reportGroupId));
  dispatch(addLoader('deleteReportGroup'));

  if (!reportGroupId) {
    dispatch(deleteReportGroupFailure(defaultError));
    dispatch(enqueueNotification('notification.reporting.deleteReport.fail', 'error'));
    dispatch(hideModal());
    dispatch(removeLoader('deleteReportGroup'));
    return;
  }

  return utils.api
    .delete({
      token: auth.accessToken,
      endpoint: endpoint.edge,
      path: `api/reportgroup/${reportGroupId}`,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleData(json))
    .then(() => {
      dispatch(deleteReportGroupSuccess(reportGroupId));
      dispatch(enqueueNotification('notification.reporting.deleteReport.success', 'success'));
      dispatch(hideModal());
      dispatch(removeLoader('deleteReportGroup'));
      return reportGroupId;
    })
    .catch((err) => {
      const errorParams = {
        ...defaultError,
        message: 'API delete error (reporting.deleteReportGroup)',
      };

      utils.api.handleError(err, errorParams);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(deleteReportGroupFailure(err));
      dispatch(enqueueNotification('notification.reporting.deleteReport.fail', 'error'));
      dispatch(hideModal());
      dispatch(removeLoader('deleteReportGroup'));
      return err;
    });
};

export const deleteReportGroupRequest = (data) => {
  return {
    type: 'REPORT_GROUP_DELETE_REQUEST',
    payload: data,
  };
};

export const deleteReportGroupSuccess = (data) => {
  return {
    type: 'REPORT_GROUP_DELETE_SUCCESS',
    payload: data,
  };
};

export const deleteReportGroupFailure = (error) => {
  return {
    type: 'REPORT_GROUP_DELETE_FAILURE',
    payload: error,
  };
};
