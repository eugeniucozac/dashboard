// app
import * as utils from 'utils';
import { authLogout, enqueueNotification, addLoader, removeLoader, hideModal } from 'stores';

export const createReportGroupExtended = (payload) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}} = getState();

  const defaultError = {
    file: 'stores/reportingExtended.actions.createReportGroupExtended',
    message: 'Data missing for POST request',
  };

  dispatch(createReportGroupExtendedRequest(payload));
  dispatch(addLoader('createReportGroupExtended'));

  if (!payload || typeof payload !== 'object') {
    dispatch(createReportGroupExtendedFailure(defaultError));
    dispatch(enqueueNotification('reportingExtended.reportingGroup.createReportGrp.failure', 'error'));
    dispatch(hideModal());
    dispatch(removeLoader('createReportGroupExtended'));
    return;
  }

  return utils.api
    .post({
      token: auth.accessToken,
      endpoint: endpoint.odsService,
      path: 'reports/group',
      data: payload,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleNewData(json))
    .then((data) => {
      dispatch(createReportGroupExtendedSuccess(data));
      dispatch(enqueueNotification('reportingExtended.reportingGroup.createReportGrp.success', 'success'));
      return data;
    })
    .catch((err) => {
      const errorParams = {
        ...defaultError,
        message: 'API post error (report group)',
      };

      utils.api.handleError(err, errorParams);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(createReportGroupExtendedFailure(err));
      dispatch(enqueueNotification('reportingExtended.reportingGroup.createReportGrp.failure', 'error'));
      return err;
    })
    .finally(() => {
      dispatch(hideModal());
      dispatch(removeLoader('createReportGroupExtended'));
    });
};

export const createReportGroupExtendedRequest = (payload) => {
  return {
    type: 'REPORTING_EXTENDED_CREATE_REPORT_GROUP_REQUEST',
    payload,
  };
};

export const createReportGroupExtendedSuccess = (data) => {
  return {
    type: 'REPORTING_EXTENDED_CREATE_REPORT_GROUP_SUCCESS',
    data,
  };
};

export const createReportGroupExtendedFailure = (error) => {
  return {
    type: 'REPORTING_EXTENDED_CREATE_REPORT_GROUP_FAILURE',
    payload: error,
  };
};
