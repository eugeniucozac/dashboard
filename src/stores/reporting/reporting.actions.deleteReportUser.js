import { addLoader, authLogout, removeLoader, enqueueNotification, hideModal } from 'stores';
import * as utils from 'utils';

export const deleteReportGroupUser = (reportGroupId, userId) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint } } } = getState();

  const defaultError = {
    file: 'stores/reporting.actions.deleteReportGroupUser',
  };
  if (!userId || !reportGroupId) {
    dispatch(deleteReportAdminFailure(defaultError));
    dispatch(enqueueNotification('notification.reporting.userDeleteFail', 'error'));
    dispatch(removeLoader('deleteReportGroupUser'));
    return;
  }

  dispatch(deleteReportAdminRequest(userId));
  dispatch(addLoader('deleteReportGroupUser'));

  return utils.api
    .delete({
      token: auth.accessToken,
      endpoint: endpoint.edge,
      path: `api/reportgroup/${reportGroupId}/user/${userId}`,
      data: userId,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleData(json))
    .then(() => {
      dispatch(deleteReportAdminSuccess(userId));
      dispatch(enqueueNotification('notification.reporting.userDeleteSuccess', 'success'));
      dispatch(hideModal());
      dispatch(removeLoader('deleteReportGroupUser'));
    })
    .catch((err) => {
      utils.api.handleError(err, defaultError);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(deleteReportAdminFailure(err));
      dispatch(enqueueNotification('notification.reporting.userDeleteFail', 'error'));
      dispatch(hideModal());
      dispatch(removeLoader('deleteReportGroupUser'));
      return err;
    })
    .finally(() => {
      dispatch(removeLoader('deleteReportGroupUser'));
    });
};

export const deleteReportAdminRequest = (payload) => {
  return {
    type: 'REPORT_USER_DELETE_REQUEST',
    payload,
  };
};

export const deleteReportAdminSuccess = (payload) => {
  return {
    type: 'REPORT_USER_DELETE_SUCCESS',
    payload,
  };
};

export const deleteReportAdminFailure = (error) => {
  return {
    type: 'REPORT_USER_DELETE_FAILURE',
    payload: error,
  };
};
