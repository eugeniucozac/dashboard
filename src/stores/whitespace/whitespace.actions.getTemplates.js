import { authLogout } from 'stores';
import * as utils from 'utils';

export const getTemplates = () => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}} = getState();

  const defaultError = {
    file: 'stores/whitespace.actions.get',
  };

  dispatch(getTemplatesRequest());

  return utils.api
    .get({
      token: auth.accessToken,
      endpoint: endpoint.whitespace,
      path: 'api/v1/templates',
    })
    .then((response) => utils.api.handleResponse(response))
    .then((data) => {
      dispatch(getTemplatesSuccess(data));
    })
    .catch((err) => {
      utils.api.handleError(err, defaultError);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(getTemplatesFailure(err));
      return err;
    });
};

export const getTemplatesRequest = () => {
  return {
    type: 'TEMPLATES_GET_REQUEST',
  };
};

export const getTemplatesSuccess = (payload) => {
  return {
    type: 'TEMPLATES_GET_SUCCESS',
    payload,
  };
};

export const getTemplatesFailure = (error) => {
  return {
    type: 'TEMPLATES_GET_FAILURE',
    payload: error,
  };
};
