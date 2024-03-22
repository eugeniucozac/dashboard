import { addLoader, authLogout, removeLoader, enqueueNotification, hideModal } from 'stores';
import * as utils from 'utils';

export const createUser = (newUser) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}} = getState();

  dispatch(createUserRequest(newUser));
  dispatch(addLoader('createUser'));

  const defaultError = {
    file: 'stores/admin.actions.createUser',
  };

  const rolesKeys = utils.user.getRolesString().map((role) => role.value);

  if (!utils.generic.isValidObject(newUser) || !rolesKeys.includes(newUser.role)) {
    if (!rolesKeys.includes(newUser.role)) defaultError.message = 'Invalid role type';

    dispatch(createUserFailure(defaultError));
    dispatch(enqueueNotification('notification.admin.userPostFail', 'error'));
    dispatch(removeLoader('createUser'));
    dispatch(hideModal());
    return;
  }

  const { departments, offices, ...rest } = newUser;

  const isCoBroker = utils.user.isCobroker(newUser);

  const data = {
    ...rest,
    ...(departments && { departmentIds: departments.map((department) => department.id) }),
    ...(isCoBroker && offices && { clientOfficeIds: offices.map((client) => client.id) }),
  };

  return utils.api
    .post({
      token: auth.accessToken,
      endpoint: endpoint.edge,
      path: 'api/user/',
      data,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleData(json))
    .then((data) => {
      dispatch(createUserSuccess(data));
      dispatch(enqueueNotification('notification.admin.userPostSuccess', 'success'));
    })
    .catch((err) => {
      utils.api.handleError(err, defaultError);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(createUserFailure(err));
      dispatch(enqueueNotification('notification.admin.userPostFail', 'error'));
      return err;
    })
    .finally(() => {
      dispatch(removeLoader('createUser'));
      dispatch(hideModal());
    });
};

export const createUserRequest = (payload) => {
  return {
    type: 'ADMIN_USER_CREATE_REQUEST',
    payload,
  };
};

export const createUserSuccess = (payload) => {
  return {
    type: 'ADMIN_USER_CREATE_SUCCESS',
    payload,
  };
};

export const createUserFailure = (error) => {
  return {
    type: 'ADMIN_USER_CREATE_FAILURE',
    payload: error,
  };
};
