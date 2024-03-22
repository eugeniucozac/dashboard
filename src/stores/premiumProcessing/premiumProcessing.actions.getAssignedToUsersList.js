import * as utils from 'utils';
import { authLogout, removeLoader } from 'stores';

export const getAssignedToUsersList = () => (dispatch, getState) => {
  const {
    user: { auth },
    config: {
      vars: { endpoint },
    },
  } = getState();

  return utils.api
    .get({
      token: auth.accessToken,
      endpoint: endpoint.authService,
      path: 'api/users/userByGroup',
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleNewData(json))
    .then((data) => {
      dispatch(getAssignedToUsersListSuccess(data?.data));
      return data;
    })
    .catch((error) => {
      dispatch(
        getAssignedToUsersListError(error, {
          file: 'stores/premiumProcessing.actions.getAssignedToUsersList',
        })
      );
      utils.api.handleUnauthorized(error, dispatch, authLogout);
      return error;
    })
    .finally(() => {
      dispatch(removeLoader('getAssignedToUsersList'));
    });
};

export const getAssignedToUsersListSuccess = (data) => {
  return {
    type: 'PREMIUM_PROCESSING_ASSIGNED_TO_USERS_GET_SUCCESS',
    payload: data,
  };
};

export const getAssignedToUsersListError = (error) => {
  return {
    type: 'PREMIUM_PROCESSING_ASSIGNED_TO_USERS_GET_ERROR',
    payload: error,
  };
};
