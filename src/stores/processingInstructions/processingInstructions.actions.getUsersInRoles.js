import * as utils from 'utils';
import { addLoader, removeLoader, authLogout } from 'stores';

export const getUsersInRoles = (roles) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}} = getState();

  const defaultError = {
    file: 'stores/processingInstructions.actions.getUsersInRoles',
  };

  dispatch(getUsersInRolesRequest(roles));
  dispatch(addLoader('getUsersInRoles'));

  if (utils.generic.isInvalidOrEmptyArray(roles)) {
    dispatch(getUsersInRolesFailure({ ...defaultError, message: 'Invalid roles param' }));
  }

  return utils.api
    .get({
      token: auth.accessToken,
      endpoint: endpoint.authService,
      path: `api/users/inRoles?userRoleLst=${roles.join(',')}`,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleNewData(json))
    .then((data) => {
      dispatch(getUsersInRolesSuccess(data.data));
      return data.data;
    })
    .catch((err) => {
      utils.api.handleError(err, { ...defaultError, message: 'API fetch error (processingInstructions.getUsersInRoles)' });
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(getUsersInRolesFailure(err));
      return err;
    })
    .finally(() => {
      dispatch(removeLoader('getUsersInRoles'));
    });
};

export const getUsersInRolesRequest = (payload) => {
  return {
    type: 'PROCESSING_INSTRUCTIONS_GET_USERS_IN_ROLES_REQUEST',
    payload,
  };
};

export const getUsersInRolesSuccess = (responseData) => {
  return {
    type: 'PROCESSING_INSTRUCTIONS_GET_USERS_IN_ROLES_SUCCESS',
    payload: responseData,
  };
};

export const getUsersInRolesFailure = (error) => {
  return {
    type: 'PROCESSING_INSTRUCTIONS_GET_USERS_IN_ROLES_FAILURE',
    payload: error,
  };
};
