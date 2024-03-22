import { addLoader, authLogout, removeLoader, enqueueNotification, hideModal } from 'stores';
import * as utils from 'utils';

export const userCreate = (user, setError) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}} = getState();
  const defaultError = { file: 'stores/administration.actions.userCreate' };

  dispatch(userCreateRequest(user));
  dispatch(addLoader('userCreate'));

  if (!utils.generic.isValidObject(user)) {
    dispatch(invalidUserCreateRequest(defaultError));
    dispatch(enqueueNotification('notification.user.invalidRequest', 'error'));
    dispatch(removeLoader('userCreate'));
    dispatch(hideModal());
    return;
  }

  const { role, departments, businessProcesses, team, xbInstances, groups, ...otherProps } = user;
  const postBody = {
    ...otherProps,
    ...(role && { role: parseInt(role) }),
    ...(departments && { departments: departments.map((d) => d.id) }),
    ...(businessProcesses && { businessProcesses: user.businessProcesses.map((bp) => bp.businessProcessID) }),
    ...(xbInstances && { xbInstances: user.xbInstances.map((xbi) => xbi.sourceID) }),
    ...(groups && { groups: user.groups.map((g) => g.id) }),
    organisation: 0,
    ...(team?.[0] && { organisation: team[0] }),
  };

  return utils.api
    .post({
      token: auth.accessToken,
      endpoint: endpoint.authService,
      path: 'api/users/',
      data: postBody,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((data) => utils.api.handleNewData(data))
    .then((data) => {
      dispatch(userCreateSuccess(data.data));
      dispatch(enqueueNotification('notification.user.create.ok', 'success'));
      dispatch(hideModal());
    })
    .catch((err) => {
      utils.api.handleError(err, defaultError);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(userCreateError(err));
      if (err.response.status !== 400) dispatch(enqueueNotification('notification.user.create.fail', 'error'));

      setError('emailId', {
        type: 'manual',
        message: utils.string.t('validation.emailAlreadyInUse'),
      });
      return err;
    })
    .finally(() => {
      dispatch(removeLoader('userCreate'));
    });
};

export const userCreateRequest = (payload) => {
  return {
    type: 'USER_CREATE_REQUEST',
    payload,
  };
};

export const userCreateSuccess = (payload) => {
  return {
    type: 'ADMINISTRATION_USER_CREATE_SUCCESS',
    payload,
  };
};

export const userCreateError = (error) => {
  return {
    type: 'USER_CREATE_ERROR',
    payload: error,
  };
};

export const invalidUserCreateRequest = (error) => {
  return {
    type: 'USER_CREATE_INVALID_REQUEST',
    payload: error,
  };
};
