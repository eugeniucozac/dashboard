import * as utils from 'utils';

//app
import { authLogout, addLoader, removeLoader } from 'stores';

export const getUsersForRole = (roles) => (dispatch, getState) => {
  // prettier-ignore
  const { user: {auth}, config: { vars: { endpoint }}} = getState();

  const defaultError = { file: 'stores/processingInstructions.actions.getUsersForRole' };

  dispatch(getUsersForRoleRequest());
  dispatch(addLoader('getUsersForRole'));

  return utils.api
    .get({
      token: auth.accessToken,
      endpoint: endpoint.authService,
      path: 'api/users/inRoles',
      params: { userRoleLst: roles },
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleNewData(json))
    .then((data) => {
      dispatch(getUsersForRoleSuccess(data.data));
      return data.data;
    })
    .catch((err) => {
      utils.api.handleError(err, { ...defaultError, message: 'API fetch error (processingInstructions.getProcessingInstructionId)' });
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(getUsersForRoleFailure(err));
      return err;
    })
    .finally(() => {
      dispatch(removeLoader('getUsersForRole'));
    });
};

const getUsersForRoleRequest = () => {
  return {
    type: 'PROCESSING_INSTRUCTIONS_GET_USERS_FOR_ROLE_REQUEST',
  };
};

const getUsersForRoleSuccess = (data) => {
  return {
    type: 'PROCESSING_INSTRUCTIONS_GET_USERS_FOR_ROLE_SUCCESS',
    payload: data,
  };
};

const getUsersForRoleFailure = (error) => {
  return {
    type: 'PROCESSING_INSTRUCTIONS_GET_USERS_FOR_ROLE_FAILURE',
    payload: error,
  };
};
