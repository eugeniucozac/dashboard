import { authLogout, addLoader, removeLoader } from 'stores';
import * as utils from 'utils';
import get from 'lodash/get';

export const getComplexityPolicies = (params) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}, claims} = getState();

  const defaultError = {
    file: 'stores/claims.actions.getComplexityPolicies',
  };

  dispatch(getComplexityPoliciesRequest());
  dispatch(addLoader('getComplexityPolicies'));

  const prevDirection = get(claims, 'complexityPolicies.sort.direction') || '';
  const newDirection = params.hasOwnProperty('direction') ? params.direction : prevDirection;

  const prevQuery = get(claims, 'complexityPolicies.query') || '';
  const newQuery = params.hasOwnProperty('term') ? params.term : prevQuery;

  const prevSortBy = get(claims, 'complexityPolicies.sort.by') || '';
  const newSortBy = params.hasOwnProperty('sortBy') ? params.sortBy : prevSortBy;

  const data = {
    direction: newDirection,
    page: (params && params.page) || 0,
    pageSize: (params && params.size) || claims.complexityPolicies.pageSize,
    search: newQuery,
    sortBy: newSortBy,
  };

  return utils.api
    .post({
      token: auth.accessToken,
      endpoint: endpoint.claimService,
      path: 'api/data/claims-triage/complex/policy/search',
      data,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((data) => {
      dispatch(getComplexityPoliciesSuccess(data));
      return data;
    })
    .catch((err) => {
      dispatch(getComplexityPoliciesFailure(err, defaultError));
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      return err;
    })
    .finally(() => {
      dispatch(removeLoader('getComplexityPolicies'));
    });
};

export const getComplexityPoliciesRequest = (data) => {
  return {
    type: 'CLAIMS_COMPLEXITY_GET_REQUEST',
    payload: data,
  };
};

export const getComplexityPoliciesSuccess = (data) => {
  return {
    type: 'CLAIMS_COMPLEXITY_GET_SUCCESS',
    payload: data,
  };
};

export const getComplexityPoliciesFailure = (data) => {
  return {
    type: 'CLAIMS_COMPLEXITY_GET_FAILURE',
    payload: data,
  };
};
