// app
import { authLogout } from 'stores';
import * as utils from 'utils';

export const getClient = (id) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}} = getState();

  const defaultError = {
    file: 'stores/party.actions.getClient',
  };

  dispatch(getClientRequest());

  if (!id) {
    dispatch(getClientFailure(defaultError));
    return;
  }

  const path = `api/v1/clients/${id}`;

  return utils.api
    .get({
      token: auth.accessToken,
      endpoint: endpoint.auth,
      path,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((data) => {
      dispatch(getClientSuccess(data));
      return data;
    })
    .catch((err) => {
      utils.api.handleError(err, defaultError);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(getClientFailure(err));
      return err;
    });
};

export const getClientRequest = () => {
  return {
    type: 'CLIENT_DETAIL_GET_REQUEST',
  };
};

export const getClientSuccess = (payload) => {
  return {
    type: 'CLIENT_DETAIL_GET_SUCCESS',
    payload: payload,
  };
};

export const getClientFailure = (error) => {
  return {
    type: 'CLIENT_DETAIL_GET_FAILURE',
    payload: error,
  };
};
