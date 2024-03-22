// app
import * as utils from 'utils';
import * as constants from 'consts';
import { authLogout, enqueueNotification, addLoader, removeLoader, hideModal } from 'stores';

export const createReportsExtended = (payload) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint } } } = getState();

  const defaultError = {
    file: 'stores/reportingExtended.actions.createReportsExtended',
    message: 'Data missing for POST request',
  };

  dispatch(createReportsExtendedRequest(payload));
  dispatch(addLoader('createReportsExtended'));

  if (!payload || typeof payload !== 'object') {
    dispatch(createReportsExtendedFailure(defaultError));
    dispatch(enqueueNotification('reportingExtended.reporting.createReporting.failure', 'error'));
    dispatch(hideModal());
    dispatch(removeLoader('createReportsExtended'));
    return;
  }

  const data = {
    title: payload.report,
    description: payload.description,
    powerbiReportId: payload.reportId,
    reportgroupId: payload.reportgroupId,
    sectionId: payload.sectionId,
    src: payload.source,
    workspaceId: payload.workspaceId,
  };

  return utils.api
    .post({
      token: auth.accessToken,
      endpoint: endpoint.odsService,
      path: 'reports/group/report',
      data,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleNewData(json))
    .then((data) => {
      dispatch(createReportsExtendedSuccess(data));
      dispatch(hideModal());
      dispatch(enqueueNotification('reportingExtended.reporting.createReporting.success', 'success'));
      return data;
    })
    .catch((err) => {
      const errorParams = {
        ...defaultError,
        message: 'API post error (report)',
      };

      utils.api.handleError(err, errorParams);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(createReportsExtendedFailure(err));
      if (
        err?.response?.status === constants.API_STATUS_BAD_REQUEST &&
        err?.json?.message === constants.REPORTING_EXTENDED_DUPLICATE_REPORT_NAME
      ) {
        dispatch(enqueueNotification('reportingExtended.reporting.createReporting.duplicateReportName', 'warning'));
      } else {
        dispatch(enqueueNotification('reportingExtended.reporting.createReporting.failure', 'error'));
      }
      return err;
    })
    .finally(() => {
      dispatch(removeLoader('createReportsExtended'));
    });
};

export const createReportsExtendedRequest = (payload) => {
  return {
    type: 'REPORTING_EXTENDED_CREATE_REPORT_REQUEST',
    payload,
  };
};

export const createReportsExtendedSuccess = (data) => {
  return {
    type: 'REPORTING_EXTENDED_CREATE_REPORT_SUCCESS',
    payload: data,
  };
};

export const createReportsExtendedFailure = (err) => {
  return {
    type: 'REPORTING_EXTENDED_CREATE_REPORT_FAILURE',
    payload: err,
  };
};
