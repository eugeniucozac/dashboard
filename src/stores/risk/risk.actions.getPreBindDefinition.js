// app
import { authLogout, removeLoader } from 'stores';
import * as utils from 'utils';

export const getPreBindDefinitions = (product, type, facilityId) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint } } } = getState();

  const defaultError = {
    file: 'stores/risk.actions.getPreBindDefinitions',
  };

  dispatch(getPreBindDefinitionsRequest(type));

  if (!product || !type || !facilityId) {
    dispatch(getPreBindDefinitionsFailure(defaultError));
    dispatch(removeLoader('getPreBindDefinitions'));
    return;
  }

  return utils.api
    .get({
      token: auth.accessToken,
      endpoint: endpoint.auth,
      path: `api/v1/products/${product}?type=${type}&facilityId=${facilityId}`,
    })

    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleData(json))
    .then((data) => {
      dispatch(getPreBindDefinitionsSuccess(data));
    })
    .catch((err) => {
      utils.api.handleError(err, defaultError);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(getPreBindDefinitionsFailure(err));
      return err;
    });
};

export const getPreBindDefinitionsRequest = (type) => {
  return {
    type: 'PRE_BIND_DEFINITIONS_GET_REQUEST',
    payload: type,
  };
};

export const getPreBindDefinitionsSuccess = (data) => {
  return {
    type: 'PRE_BIND_DEFINITIONS_GET_SUCCESS',
    payload: data,
  };
};

export const getPreBindDefinitionsFailure = (error) => {
  return {
    type: 'PRE_BIND_DEFINITIONS_GET_FAILURE',
    payload: error,
  };
};
