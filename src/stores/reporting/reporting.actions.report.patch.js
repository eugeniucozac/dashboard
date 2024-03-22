// app
import * as utils from 'utils';
import { authLogout, addLoader, enqueueNotification, hideModal, removeLoader } from 'stores';

export const reportingEdit = (payload) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}} = getState();
  const id = payload.id;
  const defaultError = {
    file: 'stores/reporting.action.reportingEdit',
    message: 'Data missing for PUT request',
  };

  dispatch(postEditReportRequest(payload));
  dispatch(addLoader('reportingEdit'));

  if (!payload || !payload.id) {
    dispatch(postEditEditReportFailure(defaultError));
    dispatch(enqueueNotification('notification.reporting.editReport.fail', 'error'));
    dispatch(hideModal());
    dispatch(removeLoader('reportingEdit'));
    return;
  }

  // get the data for PATCH
  const body = {
    title: payload.report,
    description: payload.description,
    powerbiReportId: payload.powerbiReportId,
  };

  return utils.api
    .patch({
      token: auth.accessToken,
      endpoint: endpoint.edge,
      path: `api/report/${id}`,
      data: body,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleData(json))
    .then((data) => {
      dispatch(postEditReportSuccess(data));
      dispatch(enqueueNotification('notification.reporting.editReportGroup.success', 'success'));
      dispatch(hideModal());
      dispatch(removeLoader('reportingEdit'));
      return data;
    })
    .catch((err) => {
      const errorParams = {
        ...defaultError,
        message: 'API fetch error (reporting.reportingEdit)',
      };

      utils.api.handleError(err, errorParams);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(postEditEditReportFailure(err));
      dispatch(enqueueNotification('notification.reporting.editReportGroup.fail', 'error'));
      dispatch(hideModal());
      dispatch(removeLoader('reportingEdit'));
      return err;
    });
};

export const postEditReportRequest = (data) => {
  return {
    type: 'REPORT_PATCH_REQUEST',
    payload: data,
  };
};

export const postEditReportSuccess = (data) => {
  return {
    type: 'REPORT_PATCH_SUCCESS',
    payload: data,
  };
};

export const postEditEditReportFailure = (error) => {
  return {
    type: 'REPORT_PATCH_FAILURE',
    payload: error,
  };
};
