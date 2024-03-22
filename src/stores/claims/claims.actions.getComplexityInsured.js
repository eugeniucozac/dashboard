import { authLogout, addLoader, removeLoader } from 'stores';
import * as utils from 'utils';
import get from 'lodash/get';

export const getComplexityInsured = (params) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}, claims } = getState();

  const defaultError = {
    file: 'stores/claims.actions.getComplexityInsured',
  };

  const prevDirection = get(claims, 'insured.sort.direction') || '';
  const newDirection = params.hasOwnProperty('direction') ? params.direction : prevDirection;

  const prevQuery = get(claims, 'insured.query') || '';
  const newQuery = params.hasOwnProperty('term') ? params.term : prevQuery;

  const prevSortBy = get(claims, 'insured.sort.by') || '';
  const newSortBy = params.hasOwnProperty('sortBy') ? params.sortBy : prevSortBy;

  const data = {
    page: (params && params.page) || 0,
    pageSize: (params && params.size) || claims.insured.pageSize,
    search: newQuery,
    sortBy: newSortBy,
    direction: newDirection,
  };

  dispatch(getComplexityInsuredRequest());
  dispatch(addLoader('getComplexityInsured'));

  return utils.api
    .post({
      token: auth.accessToken,
      endpoint: endpoint.claimService,
      path: 'api/data/claims-triage/complex/insured/search',
      data,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((data) => {
      dispatch(getComplexityInsuredSuccess(data));
      dispatch(removeLoader('getComplexityInsured'));
      return data;
    })
    .catch((err) => {
      dispatch(getComplexityInsuredFailure(err, defaultError));
      dispatch(removeLoader('getComplexityInsured'));
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      return err;
    });
};

export const getComplexityInsuredRequest = (data) => {
  return {
    type: 'CLAIMS_COMPLEXITY_INSURED_GET_REQUEST',
    payload: data,
  };
};

export const getComplexityInsuredSuccess = (data) => {
  return {
    type: 'CLAIMS_COMPLEXITY_INSURED_GET_SUCCESS',
    payload: {
      items: data.data,
      pagination: data.pagination,
    },
  };
};

export const getComplexityInsuredFailure = (data) => {
  return {
    type: 'CLAIMS_COMPLEXITY_INSURED_GET_FAILURE',
    payload: data,
  };
};
