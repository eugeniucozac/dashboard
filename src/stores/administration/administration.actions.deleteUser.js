import { addLoader, removeLoader, enqueueNotification, hideModal } from 'stores';
import * as utils from 'utils';

export const userDelete = (user) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}} = getState();

  dispatch(deleteUserRequest(user));
  dispatch(addLoader('deleteUser'));

  const defaultError = { file: 'stores/admin.actions.deleteUser' };

  if (!user?.id) {
    dispatch(deleteUserFailure(defaultError));
    dispatch(enqueueNotification('notification.user.delete.fail', 'error'));
    dispatch(removeLoader('deleteUser'));
    dispatch(hideModal());
    return;
  }

  return utils.api
    .delete({
      token: auth.accessToken,
      endpoint: endpoint.authService,
      path: `api/users/${user.id}`,
    })
    .then((response) => {
      if (response.status === 204) {
        dispatch(deleteUserSuccess(user?.id));
        dispatch(enqueueNotification('notification.user.delete.ok', 'success'));
      } else {
        dispatch(deleteUserFailure(response));
        dispatch(enqueueNotification('notification.user.delete.fail', 'error'));
      }
    })
    .finally(() => {
      dispatch(removeLoader('deleteUser'));
      dispatch(hideModal());
    });
};

export const deleteUserRequest = (payload) => {
  return {
    type: 'USER_DELETE_REQUEST',
    payload,
  };
};

export const deleteUserSuccess = (userId) => {
  return {
    type: 'ADMINISTRATION_USER_DELETE_SUCCESS',
    payload: userId,
  };
};

export const deleteUserFailure = (error) => {
  return {
    type: 'USER_DELETE_FAILURE',
    payload: error,
  };
};
