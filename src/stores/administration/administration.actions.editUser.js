import { addLoader, authLogout, removeLoader, enqueueNotification, hideModal } from 'stores';
import * as utils from 'utils';

export const userEdit = (user, id) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}} = getState();
  const defaultError = { file: 'stores/administration.actions.userEdit' };

  dispatch(userEditRequest(user));
  dispatch(addLoader('userEdit'));

  if (!utils.generic.isValidObject(user)) {
    dispatch(userEditFailure(defaultError));
    dispatch(enqueueNotification('notification.user.invalidRequest', 'error'));
    dispatch(removeLoader('userEdit'));
    dispatch(hideModal());
    return;
  }

  const { role, departments, businessProcesses, team, xbInstances, groups, ...otherProps } = user;

  const putBody = {
    ...otherProps,
    userId: id,
    ...(role && { role: parseInt(role) }),
    ...(departments && { departments: departments.map((d) => d.id) }),
    ...(businessProcesses && { businessProcesses: user.businessProcesses.map((bp) => bp.businessProcessID) }),
    ...(xbInstances && { xbInstances: user.xbInstances.map((xbi) => xbi.sourceID) }),
    ...(groups && { groups: user.groups.map((g) => g.id) }),
    organisation: 0,
    ...(team?.[0] && { organisation: parseInt(team[0]) }),
  };

  return utils.api
    .put({
      token: auth.accessToken,
      endpoint: endpoint.authService,
      path: `api/users/${id}`,
      data: putBody,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((data) => utils.api.handleNewData(data))
    .then((data) => {
      dispatch(userEditSuccess(data.data));
      dispatch(enqueueNotification('notification.user.edit.ok', 'success'));
    })
    .catch((err) => {
      utils.api.handleError(err, defaultError);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(userEditFailure(err));
      dispatch(enqueueNotification('notification.user.edit.fail', 'error'));
      return err;
    })
    .finally(() => {
      dispatch(removeLoader('userEdit'));
      dispatch(hideModal());
    });
};

export const userEditRequest = (payload) => {
  return {
    type: 'ADMINISTRATION_USER_EDIT_REQUEST',
    payload,
  };
};

export const userEditSuccess = (payload) => {
  return {
    type: 'ADMINISTRATION_USER_EDIT_SUCCESS',
    payload,
  };
};

export const userEditFailure = (error) => {
  return {
    type: 'ADMINISTRATION_USER_EDIT_FAILURE',
    payload: error,
  };
};
