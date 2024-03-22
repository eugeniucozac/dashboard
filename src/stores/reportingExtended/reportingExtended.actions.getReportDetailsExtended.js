// app
import * as utils from 'utils';
import * as constants from 'consts';
import { addLoader, authLogout, removeLoader, enqueueNotification } from 'stores';

export const getReportDetailsExtended = (reportId) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint } } } = getState();

  const defaultError = {
    file: 'stores/reportingExtended.actions.getReportDetailsExtended',
  };

  dispatch(getReportDetailsExtendedRequest(reportId));
  dispatch(addLoader('getReportDetailsExtended'));

  if (!reportId) {
    dispatch(getReportDetailsExtendedFailure(defaultError));
    dispatch(removeLoader('getReportDetailsExtended'));
    return;
  }

  return utils.api
    .get({
      token: auth.accessToken,
      endpoint: endpoint.odsService,
      path: `reports/group/report/${reportId}`,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleNewData(json))
    .then((data) => {
      dispatch(getReportDetailsExtendedSuccess(data?.data));
    })
    .catch((err) => {
      utils.api.handleError(err, defaultError);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(getReportDetailsExtendedFailure(err));
      if (err?.response?.status === constants.API_STATUS_NOT_FOUND) {
        dispatch(getReportDetailsExtendedSuccess({}));
      } else if (err?.response?.status === constants.API_STATUS_INTERNAL_SERVER_ERROR) {
        dispatch(getReportDetailsExtendedSuccess({}));
        dispatch(enqueueNotification('reportingExtended.reportingDetails.getReport.failure', 'error'));
      }
      return err;
    })
    .finally(() => {
      dispatch(removeLoader('getReportDetailsExtended'));
    });
};

export const getReportDetailsExtendedRequest = (reportId) => {
  return {
    type: 'REPORTING_EXTENDED_GET_REPORT_DETAILS_REQUEST',
    reportId,
  };
};

export const getReportDetailsExtendedSuccess = (data) => {
  return {
    type: 'REPORTING_EXTENDED_GET_REPORT_DETAILS_SUCCESS',
    payload: data,
  };
};

export const getReportDetailsExtendedFailure = (err) => {
  return {
    type: 'REPORTING_EXTENDED_GET_REPORT_DETAILS_FAILURE',
    payload: err,
  };
};
