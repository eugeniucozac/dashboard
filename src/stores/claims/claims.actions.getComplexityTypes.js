// app
import { authLogout, addLoader, removeLoader } from 'stores';
import * as utils from 'utils';

export const getComplexityTypes = () => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}} = getState();

  const defaultError = {
    file: 'stores/claims.actions.getComplexityTypes',
  };

  dispatch(getComplexityTypesRequest());
  dispatch(addLoader('getComplexityTypes'));

  return utils.api
    .get({
      token: auth.accessToken,
      endpoint: endpoint.claimService,
      path: `api/workflow/claim/complex-type`,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((data) => utils.api.handleNewData(data))
    .then((json) => {
      dispatch(getComplexityTypesSuccess(json));
      return json;
    })
    .catch((err) => {
      dispatch(getComplexityTypesFailure(err, defaultError));
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      return err;
    })
    .finally(() => {
      dispatch(removeLoader('getComplexityTypes'));
    });
};

export const getComplexityTypesRequest = () => {
  return {
    type: 'CLAIM_COMPLEXITY_TYPES_GET_REQUEST',
  };
};

export const getComplexityTypesSuccess = (json) => {
  return {
    type: 'CLAIM_COMPLEXITY_TYPES_GET_SUCCESS',
    payload: json.data,
  };
};

export const getComplexityTypesFailure = (err) => {
  return {
    type: 'CLAIM_COMPLEXITY_TYPES_GET_FAILURE',
    payload: err,
  };
};
