// app
import { authLogout, addLoader, removeLoader } from 'stores';
import * as utils from 'utils';

export const updateNotifications = (userNotificationId, userId) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}} = getState();

  const defaultError = {
    file: 'stores/notification.actions.updateNotifications',
  };

  dispatch(updateNotificationsRequest(userId));
  dispatch(addLoader('updateNotifications'));

  if (!userNotificationId || !userId) {
    dispatch(updateNotificationsFailure(defaultError));
    dispatch(removeLoader('updateNotifications'));
  }

  return utils.api
    .put({
      token: auth.accessToken,
      endpoint: endpoint.notificationService,
      path: `user?userNotificationId=${userNotificationId}&userId=${userId}`,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleNewData(json))
    .then((data) => {
      dispatch(updateNotificationsSuccess(data));
      return data;
    })
    .catch((err) => {
      utils.api.handleError(err, defaultError);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(updateNotificationsFailure(err));
      return err;
    })
    .finally(() => {
      dispatch(removeLoader('updateNotifications'));
    });
};

export const updateNotificationsRequest = (payload) => {
  return {
    type: 'NOTIFICATION_UPDATE_NOTIFICATIONS_REQUEST',
    payload,
  };
};

export const updateNotificationsSuccess = (payload) => {
  return {
    type: 'NOTIFICATION_UPDATE_NOTIFICATIONS_SUCCESS',
    payload,
  };
};

export const updateNotificationsFailure = (error) => {
  return {
    type: 'NOTIFICATION_UPDATE_NOTIFICATIONS_FAILURE',
    payload: error,
  };
};
