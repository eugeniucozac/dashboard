// app
import { authLogout } from 'stores';
import * as utils from 'utils';

export const getProgramUsers = () => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}} = getState();

  const defaultError = {
    file: 'stores/party.actions.getProgramUsers',
  };

  dispatch(getProgramUsersRequest());

  return utils.api
    .get({
      token: auth.accessToken,
      endpoint: endpoint.auth,
      path: 'api/v1/users',
    })
    .then((response) => utils.api.handleResponse(response))
    .then((data) => {
      dispatch(getProgramUsersSuccess(data));
    })
    .catch((err) => {
      utils.api.handleError(err, defaultError);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(getProgramUsersFailure(err));
      return err;
    });
};

export const getProgramUsersRequest = () => {
  return {
    type: 'PROGRAM_USERS_GET_REQUEST',
  };
};

export const getProgramUsersSuccess = (payload) => {
  return {
    type: 'PROGRAM_USERS_GET_SUCCESS',
    payload: payload,
  };
};

export const getProgramUsersFailure = (error) => {
  return {
    type: 'PROGRAM_USERS_GET_FAILURE',
    payload: error,
  };
};
