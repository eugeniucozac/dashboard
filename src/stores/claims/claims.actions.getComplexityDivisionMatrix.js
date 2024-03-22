import { authLogout, addLoader, removeLoader } from 'stores';
import * as utils from 'utils';

export const getComplexityDivisionMatrix = () => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint } } } = getState();

  const defaultError = {
    file: 'stores/claims.actions.getComplexityDivisionMatrix',
  };

  dispatch(getComplexityDivisionMatrixRequest());
  dispatch(addLoader('getComplexityDivisionMatrix'));

  return utils.api
    .get({
      token: auth.accessToken,
      endpoint: endpoint.claimService,
      path: 'api/data/claims-triage/complex/division',
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleNewData(json))
    .then((data) => {
      dispatch(getComplexityDivisionMatrixSuccess(data.data));
      dispatch(removeLoader('getComplexityDivisionMatrix'));
      return data.data;
    })
    .catch((err) => {
      dispatch(getComplexityDivisionMatrixFailure(err, defaultError));
      dispatch(removeLoader('getComplexityDivisionMatrix'));
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      return err;
    });
};

export const getComplexityDivisionMatrixRequest = () => {
  return {
    type: 'CLAIMS_COMPLEXITY_DIVISION_GET_REQUEST',
  };
};

export const getComplexityDivisionMatrixSuccess = (data) => {
  return {
    type: 'CLAIMS_COMPLEXITY_DIVISION_GET_SUCCESS',
    payload: data,
  };
};

export const getComplexityDivisionMatrixFailure = (err) => {
  return {
    type: 'CLAIMS_COMPLEXITY_DIVISION_GET_FAILURE',
    payload: err,
  };
};
