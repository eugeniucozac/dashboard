import { addLoader, authLogout, removeLoader, enqueueNotification, hideModal } from 'stores';
import * as utils from 'utils';

export const createUserProgrammes = (userId) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}} = getState();

  dispatch(createUserProgrammesRequest(userId));
  dispatch(addLoader('createUserProgrammes'));

  const defaultError = {
    file: 'stores/admin.actions.createUserProgrammes',
  };

  if (!userId) {
    dispatch(createUserProgrammesFailure(defaultError));
    dispatch(enqueueNotification('notification.admin.userProgrammesFail', 'error'));
    dispatch(removeLoader('createUserProgrammes'));
    dispatch(hideModal());
    return;
  }

  const data = { id: userId };
  const path = `api/user/programmes/${userId}`;

  return utils.api
    .put({
      token: auth.accessToken,
      endpoint: endpoint.edge,
      path,
      data,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleData(json))
    .then((data) => {
      dispatch(createUserProgrammesSuccess(data));
      dispatch(enqueueNotification('notification.admin.userPostSuccess', 'success'));
      return data;
    })
    .catch((err) => {
      utils.api.handleError(err, defaultError);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(createUserProgrammesFailure(err));
      dispatch(enqueueNotification('notification.admin.userPostFail', 'error'));
      return err;
    })
    .finally(() => {
      dispatch(removeLoader('createUserProgrammes'));
    });
};

export const createUserProgrammesRequest = (payload) => {
  return {
    type: 'ADMIN_USER_PROGRAMMES_CREATE_REQUEST',
    payload,
  };
};

export const createUserProgrammesSuccess = (payload) => {
  return {
    type: 'ADMIN_USER_PROGRAMMES_CREATE_SUCCESS',
    payload,
  };
};

export const createUserProgrammesFailure = (error) => {
  return {
    type: 'ADMIN_USER_PROGRAMMES_CREATE_FAILURE',
    payload: error,
  };
};
