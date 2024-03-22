import { addLoader, authLogout, removeLoader, enqueueNotification } from 'stores';
import * as utils from 'utils';

export const getReportingDetails = (reportId) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint } } } = getState();

  const defaultError = {
    file: 'stores/reporting.actions.getReportingDetails',
  };

  dispatch(getReportingDetailsRequest(reportId));
  dispatch(addLoader('getReportingDetails'));

  if (!reportId) {
    dispatch(getReportingDetailsFailure(defaultError));
    dispatch(removeLoader('getReportingDetails'));
    return;
  }

  return utils.api
    .get({
      token: auth.accessToken,
      endpoint: endpoint.edge,
      path: `api/report/${reportId}`,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleData(json))
    .then((data) => {
      dispatch(getReportingDetailsSuccess(data));
    })
    .catch((err) => {
      utils.api.handleError(err, defaultError);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(getReportingDetailsFailure(err));
      if (err.response.status === 500) {
        dispatch(enqueueNotification('notification.reporting.reportDetails.notFound', 'error'));
      }
      return err;
    })
    .finally(() => {
      dispatch(removeLoader('getReportingDetails'));
    });
};

export const getReportingDetailsRequest = (payload) => {
  return {
    type: 'REPORTING_DETAILS_GET_REQUEST',
    payload,
  };
};

export const getReportingDetailsSuccess = (payload) => {
  return {
    type: 'REPORTING_DETAILS_GET_SUCCESS',
    payload,
  };
};

export const getReportingDetailsFailure = (error) => {
  return {
    type: 'REPORTING_DETAILS_GET_FAILURE',
    payload: error,
  };
};

export const getReport = (payload) => {
  return {
    type: 'REPORTING_REPORT_SELECTED',
    payload,
  };
};
