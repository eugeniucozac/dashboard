import { authLogout } from 'stores';
import * as utils from 'utils';

export const getCoverages = (id) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}} = getState();

  const defaultError = {
    file: 'stores/risk.actions.getCoverage',
  };

  dispatch(getCoverageRequest(id));

  if (!id) {
    dispatch(getCoverageFailure({ ...defaultError, message: 'ID missing' }));
    return { ...defaultError, message: 'ID missing' };
  }

  return utils.api
    .get({
      token: auth.accessToken,
      endpoint: endpoint.auth,
      path: `api/v1/risks/${id}/coverages`,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleResponseJsonArray(json))
    .then((data) => {
      dispatch(getCoverageSuccess(data));
      return data;
    })
    .catch((err) => {
      utils.api.handleError(err, defaultError);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(getCoverageFailure(err));
      return err;
    });
};

export const getCoverageRequest = (id) => {
  return {
    type: 'RISK_COVERAGE_GET_REQUEST',
    payload: id,
  };
};

export const getCoverageSuccess = (data) => {
  return {
    type: 'RISK_COVERAGE_GET_SUCCESS',
    payload: data,
  };
};

export const getCoverageFailure = (error) => {
  return {
    type: 'RISK_COVERAGE_GET_FAILURE',
    payload: error,
  };
};
