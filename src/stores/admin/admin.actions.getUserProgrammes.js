// app
import { authLogout } from 'stores';
import * as utils from 'utils';

export const getUserProgrammes = (programmesUserId) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}} = getState();

  const defaultError = {
    file: 'stores/admin.actions.getUserProgrammes',
  };

  if (!programmesUserId) {
    dispatch(getUserProgrammesFailure(defaultError));

    return;
  }

  dispatch(getUserProgrammesRequest());

  const path = `api/v1/users/edge/${programmesUserId}`;

  return utils.api
    .get({
      token: auth.accessToken,
      endpoint: endpoint.auth,
      path,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((data) => {
      dispatch(getUserProgrammesSuccess(data));
      return data;
    })
    .catch((err) => {
      utils.api.handleError(err, defaultError);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(getUserProgrammesFailure(err));
      return err;
    });
};

export const getUserProgrammesRequest = () => {
  return {
    type: 'USER_PROGRAMMES_GET_REQUEST',
  };
};

export const getUserProgrammesSuccess = (payload) => {
  return {
    type: 'USER_PROGRAMMES_GET_SUCCESS',
    payload: {
      content: payload?.content ? payload.content : payload,
      pagination: payload?.pagination,
    },
  };
};

export const getUserProgrammesFailure = (error) => {
  return {
    type: 'USER_PROGRAMMES_GET_FAILURE',
    payload: error,
  };
};
