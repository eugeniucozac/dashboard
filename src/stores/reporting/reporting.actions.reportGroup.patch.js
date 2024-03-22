// app
import * as utils from 'utils';
import { authLogout, addLoader, enqueueNotification, hideModal, removeLoader } from 'stores';

export const reportingGroupEdit = (payload) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}} = getState();
  const id = payload.id;
  const defaultError = {
    file: 'stores/reporting.action.reportingGroupEdit',
    message: 'Data missing for PATCH request',
  };

  dispatch(postEditReportGroupRequest(payload));
  dispatch(addLoader('reportingGroupEdit'));

  if (!payload || !payload.id) {
    dispatch(postEditEditReportGroupFailure(defaultError));
    dispatch(enqueueNotification('notification.reporting.editReport.fail', 'error'));
    dispatch(hideModal());
    dispatch(removeLoader('reportingGroupEdit'));
    return;
  }

  // get the data for PATCH
  const body = {
    name: payload.name,
    description: payload.description,
  };

  return utils.api
    .patch({
      token: auth.accessToken,
      endpoint: endpoint.edge,
      path: `api/reportgroup/${id}`,
      data: body,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleData(json))
    .then((data) => {
      dispatch(postEditReportGroupSuccess(data));
      dispatch(enqueueNotification('notification.reporting.editReport.success', 'success'));
      dispatch(hideModal());
      dispatch(removeLoader('reportingGroupEdit'));
      return data;
    })
    .catch((err) => {
      const errorParams = {
        ...defaultError,
        message: 'API fetch error (reporting.reportingGroupEdit)',
      };

      utils.api.handleError(err, errorParams);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(postEditEditReportGroupFailure(err));
      dispatch(enqueueNotification('notification.reporting.editReport.fail', 'error'));
      dispatch(hideModal());
      dispatch(removeLoader('reportingGroupEdit'));
      return err;
    });
};

export const postEditReportGroupRequest = (data) => {
  return {
    type: 'REPORTING_GROUP_PATCH_REQUEST',
    payload: data,
  };
};

export const postEditReportGroupSuccess = (data) => {
  return {
    type: 'REPORTING_GROUP_PATCH_SUCCESS',
    payload: data,
  };
};

export const postEditEditReportGroupFailure = (error) => {
  return {
    type: 'REPORTING_GROUP_PATCH_FAILURE',
    payload: error,
  };
};
