// app
import * as utils from 'utils';
import { authLogout, addLoader, enqueueNotification, hideModal, removeLoader } from 'stores';

export const editReportGroupExtended = (reportGroupObj) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}} = getState();

  const { description, id, name } = reportGroupObj;

  const defaultError = {
    file: 'stores/reportingExtended.actions.editReportGroupExtended',
    message: 'Data missing for PATCH request',
  };

  dispatch(editReportGroupExtendedRequest(reportGroupObj));
  dispatch(addLoader('editReportGroupExtended'));

  if (!reportGroupObj || !description || !id || !name) {
    dispatch(editReportGroupExtendedFailure(defaultError));
    dispatch(enqueueNotification('reportingExtended.reportingGroup.editReportGrp.failure', 'error'));
    dispatch(hideModal());
    dispatch(removeLoader('editReportGroupExtended'));
    return;
  }

  return utils.api
    .patch({
      token: auth.accessToken,
      endpoint: endpoint.odsService,
      path: `reports/group/${id}`,
      data: {
        name,
        description,
      },
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleNewData(json))
    .then((data) => {
      dispatch(editReportGroupExtendedSuccess(data));
      dispatch(enqueueNotification('reportingExtended.reportingGroup.editReportGrp.success', 'success'));
      return data;
    })
    .catch((err) => {
      const errorParams = {
        ...defaultError,
        message: 'API fetch error (reportingExtended.editReportExtendedGroup)',
      };

      utils.api.handleError(err, errorParams);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(editReportGroupExtendedFailure(err));
      dispatch(enqueueNotification('reportingExtended.reportingGroup.editReportGrp.failure', 'error'));
      return err;
    })
    .finally(() => {
      dispatch(hideModal());
      dispatch(removeLoader('editReportGroupExtended'));
    });
};

export const editReportGroupExtendedRequest = (reportGroupObj) => {
  return {
    type: 'REPORTING_EXTENDED_EDIT_REPORT_GROUP_REQUEST',
    payload: reportGroupObj,
  };
};

export const editReportGroupExtendedSuccess = (data) => {
  return {
    type: 'REPORTING_EXTENDED_EDIT_REPORT_GROUP_SUCCESS',
    payload: data,
  };
};

export const editReportGroupExtendedFailure = (err) => {
  return {
    type: 'REPORTING_EXTENDED_EDIT_REPORT_GROUP_FAILURE',
    payload: err,
  };
};
