// app
import { authLogout, addLoader, removeLoader } from 'stores';
import * as utils from 'utils';

export const getModellingTask = (modelId) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}} = getState();

  const defaultError = {
    file: 'stores/modelling.actions.get',
  };

  dispatch(getModellingRequest(modelId));
  dispatch(addLoader('modelling'));

  if (!modelId) {
    dispatch(getModellingFailure(defaultError));
    dispatch(removeLoader('getModelling'));
  }

  return utils.api
    .get({
      token: auth.accessToken,
      endpoint: endpoint.edge,
      path: `api/modelling/${modelId}`,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleData(json))
    .then((data) => {
      dispatch(getModellingSuccess(data));
    })
    .catch((err) => {
      utils.api.handleError(err, defaultError);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(getModellingFailure(err));
      return err;
    })
    .finally(() => {
      dispatch(removeLoader('modelling'));
    });
};

export const getModellingRequest = (payload) => {
  return {
    type: 'MODELLING_GET_REQUEST',
    payload,
  };
};

export const getModellingSuccess = (payload) => {
  return {
    type: 'MODELLING_GET_SUCCESS',
    payload,
  };
};

export const getModellingFailure = (error) => {
  return {
    type: 'MODELLING_GET_FAILURE',
    payload: error,
  };
};
