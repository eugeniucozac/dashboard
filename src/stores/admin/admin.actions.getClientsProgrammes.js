// app
import { authLogout } from 'stores';
import * as utils from 'utils';

export const getClientsProgrammes = () => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}} = getState();

  const defaultError = {
    file: 'stores/admin.actions.getClientsProgrammes',
  };

  dispatch(getClientsProgrammesRequest());

  const path = `api/v1/clients/edge`;

  return utils.api
    .get({
      token: auth.accessToken,
      endpoint: endpoint.auth,
      path,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((data) => {
      dispatch(getClientsProgrammesSuccess(data));
      return data;
    })
    .catch((err) => {
      utils.api.handleError(err, defaultError);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(getClientsProgrammesFailure(err));
      return err;
    });
};

export const getClientsProgrammesRequest = () => {
  return {
    type: 'CLIENTS_PROGRAMMES_GET_REQUEST',
  };
};

export const getClientsProgrammesSuccess = (payload) => {
  return {
    type: 'CLIENTS_PROGRAMMES_GET_SUCCESS',
    payload,
  };
};

export const getClientsProgrammesFailure = (error) => {
  return {
    type: 'CLIENTS_PROGRAMMES_GET_FAILURE',
    payload: error,
  };
};
