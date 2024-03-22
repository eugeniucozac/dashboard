// app
import { authLogout, addLoader, removeLoader } from 'stores';
import * as utils from 'utils';

export const deleteSingleNotification = (userNotificationId, userId) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}} = getState();

  const defaultError = {
    file: 'stores/notification.actions.deleteSingleNotification',
  };

  dispatch(deleteSingleNotificationRequest(userId));
  dispatch(addLoader('deleteSingleNotification'));

  if (!userNotificationId || !userId) {
    dispatch(deleteSingleNotificationFailure(defaultError));
    dispatch(removeLoader('deleteSingleNotification'));
  }

  return utils.api
    .delete({
      token: auth.accessToken,
      endpoint: endpoint.notificationService,
      path: `user?userNotificationId=${userNotificationId}&userId=${userId}`,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleNewData(json))
    .then((data) => {
      dispatch(deleteSingleNotificationSuccess(data));
      return data;
    })
    .catch((err) => {
      utils.api.handleError(err, defaultError);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(deleteSingleNotificationFailure(err));
      return err;
    })
    .finally(() => {
      dispatch(removeLoader('deleteSingleNotification'));
    });
};

export const deleteSingleNotificationRequest = (userId) => {
  return {
    type: 'NOTIFICATION_DELETE_SINGLE_NOTIFICATION_REQUEST',
    userId,
  };
};

export const deleteSingleNotificationSuccess = (data) => {
  return {
    type: 'NOTIFICATION_DELETE_SINGLE_NOTIFICATION_SUCCESS',
    data,
  };
};

export const deleteSingleNotificationFailure = (error) => {
  return {
    type: 'NOTIFICATION_DELETE_SINGLE_NOTIFICATION_FAILURE',
    payload: error,
  };
};
