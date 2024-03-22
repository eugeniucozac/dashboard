// app
import { authLogout, addLoader, removeLoader } from 'stores';
import * as utils from 'utils';

export const deleteAllNotifications = (userId) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}} = getState();

  const defaultError = {
    file: 'stores/notification.actions.deleteAllNotifications',
  };

  dispatch(deleteAllNotificationsRequest(userId));
  dispatch(addLoader('deleteAllNotifications'));

  if (!userId) {
    dispatch(deleteAllNotificationsFailure(defaultError));
    dispatch(removeLoader('deleteAllNotifications'));
  }

  return utils.api
    .delete({
      token: auth.accessToken,
      endpoint: endpoint.notificationService,
      path: `user/deleteAllNotifications?userId=${userId}`,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleNewData(json))
    .then((data) => {
      dispatch(deleteAllNotificationsSuccess(data));
      return data;
    })
    .catch((err) => {
      utils.api.handleError(err, defaultError);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(deleteAllNotificationsFailure(err));
      return err;
    })
    .finally(() => {
      dispatch(removeLoader('deleteAllNotifications'));
    });
};

export const deleteAllNotificationsRequest = (userId) => {
  return {
    type: 'NOTIFICATION_DELETE_ALL_NOTIFICATIONS_REQUEST',
    userId,
  };
};

export const deleteAllNotificationsSuccess = (data) => {
  return {
    type: 'NOTIFICATION_DELETE_ALL_NOTIFICATIONS_SUCCESS',
    data,
  };
};

export const deleteAllNotificationsFailure = (error) => {
  return {
    type: 'NOTIFICATION_DELETE_ALL_NOTIFICATIONS_FAILURE',
    payload: error,
  };
};
