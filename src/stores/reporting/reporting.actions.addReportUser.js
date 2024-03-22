import { addLoader, authLogout, removeLoader, enqueueNotification } from 'stores';
import * as utils from 'utils';

export const addReportGroupUser = (reportGroupId, newUser) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint } } } = getState();
  const userId = [newUser?.id];

  const defaultError = {
    file: 'stores/reporting.actions.addReportGroupUser',
  };
  if (!userId || !reportGroupId) {
    dispatch(createReportAdminFailure(defaultError));
    dispatch(enqueueNotification('notification.reporting.userPostFail', 'error'));
    dispatch(removeLoader('addReportGroupUser'));
    return;
  }

  dispatch(createReportAdminRequest(userId));
  dispatch(addLoader('addReportGroupUser'));

  return utils.api
    .post({
      token: auth.accessToken,
      endpoint: endpoint.edge,
      path: `api/reportgroup/${reportGroupId}/user`,
      data: userId,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleData(json))
    .then((data) => {
      dispatch(createReportAdminSuccess(data?.users));
      dispatch(enqueueNotification('notification.reporting.userPostSuccess', 'success'));
    })
    .catch((err) => {
      utils.api.handleError(err, defaultError);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(createReportAdminFailure(err));
      dispatch(enqueueNotification('notification.reporting.userPostFail', 'error'));
      return err;
    })
    .finally(() => {
      dispatch(removeLoader('addReportGroupUser'));
    });
};

export const createReportAdminRequest = (payload) => {
  return {
    type: 'REPORT_USER_CREATE_REQUEST',
    payload,
  };
};

export const createReportAdminSuccess = (payload) => {
  return {
    type: 'REPORT_USER_CREATE_SUCCESS',
    payload,
  };
};

export const createReportAdminFailure = (error) => {
  return {
    type: 'REPORT_USER_CREATE_FAILURE',
    payload: error,
  };
};
