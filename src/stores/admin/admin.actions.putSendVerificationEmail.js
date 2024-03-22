import { addLoader, authLogout, removeLoader, enqueueNotification, hideModal } from 'stores';
import * as utils from 'utils';

export const sendVerificationEmail = (userId) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}} = getState();

  dispatch(sendVerificationEmailRequest(userId));
  dispatch(addLoader('sendVerificationEmail'));

  const defaultError = {
    file: 'stores/admin.actions.sendVerificationEmail',
  };

  if (!userId) {
    dispatch(sendVerificationEmailFailure(defaultError));
    dispatch(enqueueNotification('notification.sendEmailVerification.fail', 'error'));
    dispatch(removeLoader('sendVerificationEmail'));
    dispatch(hideModal());
    return;
  }

  const data = { id: userId };
  const path = `api/user/${userId}/verify`;

  return utils.api
    .put({
      token: auth.accessToken,
      endpoint: endpoint.edge,
      path,
      data,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((data) => {
      dispatch(sendVerificationEmailSuccess(data));
      dispatch(enqueueNotification('notification.sendEmailVerification.success', 'success'));
      return data;
    })
    .catch((err) => {
      utils.api.handleError(err, defaultError);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(sendVerificationEmailFailure(err));
      dispatch(enqueueNotification('notification.sendEmailVerification.fail', 'error'));
      return err;
    })
    .finally(() => {
      dispatch(removeLoader('sendVerificationEmail'));
    });
};

export const sendVerificationEmailRequest = (payload) => {
  return {
    type: 'ADMIN_USER_SEND_VERIFICATION_EMAIL_REQUEST',
    payload,
  };
};

export const sendVerificationEmailSuccess = (payload) => {
  return {
    type: 'ADMIN_USER_SEND_VERIFICATION_EMAIL_SUCCESS',
    payload,
  };
};

export const sendVerificationEmailFailure = (error) => {
  return {
    type: 'ADMIN_USER_SEND_VERIFICATION_EMAIL_FAILURE',
    payload: error,
  };
};
