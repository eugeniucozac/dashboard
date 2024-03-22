// app
import * as utils from 'utils';
import { authLogout, addLoader, enqueueNotification, hideModal, removeLoader } from 'stores';

export const editReportsExtended = (reportObj) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}} = getState();

  const { report, reportId, reportgroupId, sectionId, workspaceId, description, powerbiReportId, source } = reportObj;

  const defaultError = {
    file: 'stores/reportingExtended.actions.editReportsExtended',
    message: 'Data missing for PUT request',
  };

  dispatch(editReportsExtendedRequest(reportObj));
  dispatch(addLoader('editReportsExtended'));

  if (typeof reportObj !== 'object' || !report || !reportId || !source) {
    dispatch(editReportsExtendedFailure(defaultError));
    dispatch(enqueueNotification('reportingExtended.reporting.editReporting.failure', 'error'));
    dispatch(hideModal());
    dispatch(removeLoader('editReportsExtended'));
    return;
  }

  const body = {
    title: report,
    description: description,
    powerbiReportId: powerbiReportId,
    reportgroupId: reportgroupId,
    sectionId: sectionId,
    src: source,
    workspaceId: workspaceId,
  };

  return utils.api
    .patch({
      token: auth.accessToken,
      endpoint: endpoint.odsService,
      path: `reports/group/report/${reportId}`,
      data: body,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleNewData(json))
    .then((data) => {
      dispatch(editReportsExtendedSuccess(data));
      dispatch(enqueueNotification('reportingExtended.reporting.editReporting.success', 'success'));
      return data;
    })
    .catch((err) => {
      const errorParams = {
        ...defaultError,
        message: 'API fetch error (reportingExtended.editReportsExtended)',
      };

      utils.api.handleError(err, errorParams);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(editReportsExtendedFailure(err));
      dispatch(enqueueNotification('reportingExtended.reporting.editReporting.failure', 'error'));
      return err;
    })
    .finally(() => {
      dispatch(hideModal());
      dispatch(removeLoader('editReportsExtended'));
    });
};

export const editReportsExtendedRequest = (reportObj) => {
  return {
    type: 'REPORTING_EXTENDED_EDIT_REPORT_REQUEST',
    reportObj,
  };
};

export const editReportsExtendedSuccess = (data) => {
  return {
    type: 'REPORTING_EXTENDED_EDIT_REPORT_SUCCESS',
    payload: data,
  };
};

export const editReportsExtendedFailure = (err) => {
  return {
    type: 'REPORTING_EXTENDED_EDIT_REPORT_FAILURE',
    payload: err,
  };
};
