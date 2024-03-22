import { authLogout, addLoader, removeLoader } from 'stores';
import * as utils from 'utils';
import get from 'lodash/get';

export const getComplexityPoliciesFlagged = (params) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}, claims} = getState();

  const defaultError = {
    file: 'stores/claims.actions.getComplexityPoliciesFlagged',
  };

  dispatch(getComplexityPoliciesFlaggedRequest());
  dispatch(addLoader('getComplexityPoliciesFlagged'));

  const prevDirection = get(claims, 'complexityPoliciesFlagged.sort.direction') || '';
  const newDirection = params.hasOwnProperty('direction') ? params.direction : prevDirection;

  const prevQuery = get(claims, 'complexityPoliciesFlagged.query') || null;
  const newQuery = params.hasOwnProperty('term') ? params.term : prevQuery;

  const prevSortBy = get(claims, 'complexityPoliciesFlagged.sort.by') || '';
  const newSortBy = params.hasOwnProperty('sortBy') ? params.sortBy : prevSortBy;

  const data = {
    direction: newDirection,
    page: (params && params.page) || 0,
    pageSize: (params && params.size) || claims.complexityPoliciesFlagged.pageSize,
    search: newQuery,
    sortBy: newSortBy,
    filterLossClaimsCriteriaDTO: null,
  };

  return utils.api
    .post({
      token: auth.accessToken,
      endpoint: endpoint.claimService,
      path: 'api/data/claims-triage/complex/policy/main/search',
      data,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((data) => {
      dispatch(getComplexityPoliciesFlaggedSuccess(data));
      dispatch(removeLoader('getComplexityPoliciesFlagged'));
      return data;
    })
    .catch((err) => {
      dispatch(getComplexityPoliciesFlaggedFailure(err, defaultError));
      dispatch(removeLoader('getComplexityPoliciesFlagged'));
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      return err;
    });
};

export const getComplexityPoliciesFlaggedRequest = (data) => {
  return {
    type: 'CLAIMS_COMPLEXITY_FLAGGED_GET_REQUEST',
    payload: data,
  };
};

export const getComplexityPoliciesFlaggedSuccess = (data) => {
  return {
    type: 'CLAIMS_COMPLEXITY_FLAGGED_GET_SUCCESS',
    payload: {
      items: data.data,
      pagination: data.pagination,
    },
  };
};

export const getComplexityPoliciesFlaggedFailure = (data) => {
  return {
    type: 'CLAIMS_COMPLEXITY_FLAGGED_GET_FAILURE',
    payload: data,
  };
};
