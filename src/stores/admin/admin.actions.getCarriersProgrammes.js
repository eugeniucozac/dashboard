// app
import { authLogout } from 'stores';
import * as utils from 'utils';

export const getCarriersProgrammes = () => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}} = getState();

  const defaultError = {
    file: 'stores/admin.actions.getCarriersProgrammes',
  };

  dispatch(getCarriersProgrammesRequest());

  const path = `api/v1/carriers/edge`;

  return utils.api
    .get({
      token: auth.accessToken,
      endpoint: endpoint.auth,
      path,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((data) => {
      dispatch(getCarriersProgrammesSuccess(data));
      return data;
    })
    .catch((err) => {
      utils.api.handleError(err, defaultError);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(getCarriersProgrammesFailure(err));
      return err;
    });
};

export const getCarriersProgrammesRequest = () => {
  return {
    type: 'CARRIERS_PROGRAMMES_GET_REQUEST',
  };
};

export const getCarriersProgrammesSuccess = (payload) => {
  return {
    type: 'CARRIERS_PROGRAMMES_GET_SUCCESS',
    payload,
  };
};

export const getCarriersProgrammesFailure = (error) => {
  return {
    type: 'CARRIERS_PROGRAMMES_GET_FAILURE',
    payload: error,
  };
};
