import isEmpty from 'lodash/isEmpty';
import { addLoader, authLogout, removeLoader, enqueueNotification, hideModal } from 'stores';
import * as utils from 'utils';

export const editUser = (editedUser, previousUser) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}} = getState();

  dispatch(editUserRequest(editedUser));
  dispatch(addLoader('editUser'));

  const defaultError = {
    file: 'stores/admin.actions.editUser',
  };

  const rolesKeys = utils.user.getRolesString().map((role) => role.value);

  if (!utils.generic.isValidObject(editedUser) || !rolesKeys.includes(editedUser.role) || !utils.generic.isValidObject(previousUser)) {
    if (!rolesKeys.includes(editedUser.role)) defaultError.message = 'Invalid role type';

    dispatch(editUserFailure(defaultError));
    dispatch(enqueueNotification('notification.admin.userPatchFail', 'error'));
    dispatch(removeLoader('editUser'));
    dispatch(hideModal());
    return;
  }

  const { departments, offices, carriers, clients, products, coverholder, ...rest } = editedUser;

  const isCoBroker = utils.user.isCobroker(editedUser);

  const editedUserToIds = {
    ...rest,
    ...(departments && { departmentIds: departments.map((department) => department.id) }),
    ...(offices && { clientOfficeIds: isCoBroker ? offices.map((office) => office.id) : [] }),
  };

  const previousUserToIds = {
    ...previousUser,
    clientOfficeIds: previousUser.offices.map((office) => office.id),
  };

  const patchChanges = utils.generic.getDifferences(previousUserToIds, editedUserToIds);
  if (!isEmpty(patchChanges)) {
    return utils.api
      .patch({
        token: auth.accessToken,
        endpoint: endpoint.edge,
        path: `api/user/${previousUser.id}`,
        data: patchChanges,
      })
      .then((response) => utils.api.handleResponse(response))
      .then((json) => utils.api.handleData(json))
      .then((data) => {
        dispatch(editUserSuccess(data));
        dispatch(enqueueNotification('notification.admin.userPatchSuccess', 'success'));
      })
      .catch((err) => {
        utils.api.handleError(err, defaultError);
        utils.api.handleUnauthorized(err, dispatch, authLogout);
        dispatch(editUserFailure(err));
        dispatch(enqueueNotification('notification.admin.userPatchFail', 'error'));
        return err;
      })
      .finally(() => {
        dispatch(removeLoader('editUser'));
        dispatch(hideModal());
      });
  } else {
    dispatch(removeLoader('editUser'));
    dispatch(hideModal());
  }
};

export const editUserRequest = (payload) => {
  return {
    type: 'ADMIN_USER_EDIT_REQUEST',
    payload,
  };
};

export const editUserSuccess = (payload) => {
  return {
    type: 'ADMIN_USER_EDIT_SUCCESS',
    payload,
  };
};

export const editUserFailure = (error) => {
  return {
    type: 'ADMIN_USER_EDIT_FAILURE',
    payload: error,
  };
};
