// app
import * as utils from 'utils';
import * as constants from 'consts';
import { addLoader, authLogout, enqueueNotification, hideModal, removeLoader } from 'stores';

export const deleteReportGroupExtended = (reportGroupId) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}} = getState();

  const defaultError = {
    file: 'stores/reportingExtended.actions.deleteReportGroupExtended',
    message: 'Data missing for DELETE request',
  };

  dispatch(deleteReportGroupExtendedRequest(reportGroupId));
  dispatch(addLoader('deleteReportGroupExtended'));

  if (!reportGroupId) {
    dispatch(deleteReportGroupExtendedFailure(defaultError));
    dispatch(enqueueNotification('reportingExtended.reportingGroup.deleteReportGrp.failure', 'error'));
    dispatch(hideModal());
    dispatch(removeLoader('deleteReportGroupExtended'));
    return;
  }

  return utils.api
    .delete({
      token: auth.accessToken,
      endpoint: endpoint.odsService,
      path: `reports/group/${reportGroupId}`,
    })
    .then((response) => {
      if (response?.status === constants.API_RESPONSE_NO_CONTENT_STATUS) {
        dispatch(deleteReportGroupExtendedSuccess(reportGroupId));
        dispatch(enqueueNotification('reportingExtended.reportingGroup.deleteReportGrp.success', 'success'));
        return response;
      } else {
        return Promise.reject({
          message: 'API delete error (reportingExtended.deleteReportExtendedGroup)',
        });
      }
    })
    .catch((err) => {
      const errorParams = {
        ...defaultError,
        message: 'API delete error (reportingExtended.deleteReportExtendedGroup)',
      };

      utils.api.handleError(err, errorParams);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(deleteReportGroupExtendedFailure(err));
      dispatch(enqueueNotification('reportingExtended.reportingGroup.deleteReportGrp.failure', 'error'));
      return err;
    })
    .finally(() => {
      dispatch(hideModal());
      dispatch(removeLoader('deleteReportGroupExtended'));
    });
};

export const deleteReportGroupExtendedRequest = (reportGroupId) => {
  return {
    type: 'REPORTING_EXTENDED_DELETE_REPORT_GROUP_REQUEST',
    payload: reportGroupId,
  };
};

export const deleteReportGroupExtendedSuccess = (reportGroupId) => {
  return {
    type: 'REPORTING_EXTENDED_DELETE_REPORT_GROUP_SUCCESS',
    payload: reportGroupId,
  };
};

export const deleteReportGroupExtendedFailure = (err) => {
  return {
    type: 'REPORTING_EXTENDED_DELETE_REPORT_GROUP_FAILURE',
    payload: err,
  };
};
