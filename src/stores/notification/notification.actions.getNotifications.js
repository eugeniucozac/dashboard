// app
import { authLogout } from 'stores';
import * as utils from 'utils';

export const getNotifications = (userId) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}} = getState();

  const defaultError = {
    file: 'stores/notification.actions.getNotifications',
  };

  dispatch(getNotificationsRequest(userId));
  dispatch(getNotificationsLoading(true));

  if (!userId) {
    dispatch(getNotificationsFailure(defaultError));
  }

  return utils.api
    .get({
      token: auth.accessToken,
      endpoint: endpoint.notificationService,
      path: `user?userId=${userId}`,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleNewData(json))
    .then((data) => {
      dispatch(getNotificationsSuccess(data?.data));
      return data?.data;
    })
    .catch((err) => {
      utils.api.handleError(err, defaultError);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(getNotificationsFailure(utils.string.t('globalNotification.fetchError')));
      return err;
    })
    .finally(() => {
      dispatch(getNotificationsLoading(false));
    });
};

export const getNotificationsRequest = (payload) => {
  return {
    type: 'NOTIFICATION_GET_NOTIFICATIONS_REQUEST',
    payload,
  };
};

export const getNotificationsSuccess = (payload) => {
  return {
    type: 'NOTIFICATION_GET_NOTIFICATIONS_SUCCESS',
    payload,
  };
};

export const getNotificationsFailure = (error) => {
  return {
    type: 'NOTIFICATION_GET_NOTIFICATIONS_FAILURE',
    payload: error,
  };
};

export const getNotificationsLoading = (loading) => {
  return {
    type: 'NOTIFICATION_GET_NOTIFICATIONS_LOADING',
    payload: loading,
  };
};
