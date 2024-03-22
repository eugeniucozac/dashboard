// app
import * as utils from 'utils';
import * as constants from 'consts';
import { addLoader, authLogout, enqueueNotification, hideModal, removeLoader } from 'stores';

export const deleteReportsExtended = (reportId) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}} = getState();

  const defaultError = {
    file: 'stores/reportingExtended.actions.deleteReportsExtended',
    message: 'Data missing for DELETE request',
  };

  dispatch(deleteReportsExtendedRequest(reportId));
  dispatch(addLoader('deleteReportsExtended'));

  if (!reportId) {
    dispatch(deleteReportsExtendedFailure(defaultError));
    dispatch(enqueueNotification('reportingExtended.reporting.deleteReporting.failure', 'error'));
    dispatch(removeLoader('deleteReportsExtended'));
    return;
  }

  return utils.api
    .delete({
      token: auth.accessToken,
      endpoint: endpoint.odsService,
      path: `reports/group/report/${reportId}`,
    })
    .then((response) => {
      if (response?.status === constants.API_RESPONSE_NO_CONTENT_STATUS) {
        dispatch(deleteReportsExtendedSuccess(reportId));
        dispatch(enqueueNotification('reportingExtended.reporting.deleteReporting.success', 'success'));
        return response;
      } else {
        return Promise.reject({
          message: 'API delete error (reportingExtended.deleteReportsExtended)',
        });
      }
    })
    .catch((err) => {
      const errorParams = {
        ...defaultError,
        message: 'API delete error (reportingExtended.deleteReportsExtended)',
      };

      utils.api.handleError(err, errorParams);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(deleteReportsExtendedFailure(err));
      dispatch(enqueueNotification('reportingExtended.reporting.deleteReporting.failure', 'error'));
      return err;
    })
    .finally(() => {
      dispatch(hideModal());
      dispatch(removeLoader('deleteReportsExtended'));
    });
};

export const deleteReportsExtendedRequest = (reportId) => {
  return {
    type: 'REPORTING_EXTENDED_DELETE_REPORT_REQUEST',
    payload: reportId,
  };
};

export const deleteReportsExtendedSuccess = (reportId) => {
  return {
    type: 'REPORTING_EXTENDED_DELETE_REPORT_SUCCESS',
    payload: reportId,
  };
};

export const deleteReportsExtendedFailure = (err) => {
  return {
    type: 'REPORTING_EXTENDED_DELETE_REPORT_FAILURE',
    payload: err,
  };
};
