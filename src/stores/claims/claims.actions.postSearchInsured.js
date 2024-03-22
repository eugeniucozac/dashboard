import { addLoader, authLogout, removeLoader } from 'stores';
import * as utils from 'utils';
import get from 'lodash/get';

export const postSearchInsured = (params) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}, claims} = getState();

  const defaultError = {
    file: 'stores/claims.actions.postSearchInsured',
  };

  dispatch(postSearchInsuredRequest());
  dispatch(addLoader('postSearchInsured'));

  const prevDirection = get(claims, 'complexInsured.sort.direction') || '';
  const newDirection = params.hasOwnProperty('direction') ? params.direction : prevDirection;

  const prevQuery = get(claims, 'complexInsured.query') || '';
  const newQuery = params.hasOwnProperty('term') ? params.term : prevQuery;

  const prevSortBy = get(claims, 'complexInsured.sort.by') || '';
  const newSortBy = params.hasOwnProperty('sortBy') ? params.sortBy : prevSortBy;

  const data = {
    direction: newDirection,
    page: (params && params.page) || 0,
    pageSize: (params && params.size) || claims.complexInsured.pageSize,
    search: newQuery,
    sortBy: newSortBy,
    filterLossClaimsCriteriaDTO: null,
  };

  return utils.api
    .post({
      token: auth.accessToken,
      endpoint: endpoint.claimService,
      path: 'api/data/claims-triage/complex/add-insured/search',
      data,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((data) => {
      dispatch(postSearchInsuredSuccess(data));
      dispatch(removeLoader('postSearchInsured'));
      return data;
    })
    .catch((err) => {
      dispatch(postSearchInsuredFailure(err, defaultError));
      dispatch(removeLoader('postSearchInsured'));
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      return err;
    });
};

export const postSearchInsuredRequest = (data) => {
  return {
    type: 'CLAIMS_COMPLEXITY_SEARCH_POST_REQUEST',
    payload: data,
  };
};

export const postSearchInsuredSuccess = (data) => {
  return {
    type: 'CLAIMS_COMPLEXITY_SEARCH_POST_SUCCESS',
    payload: data,
  };
};

export const postSearchInsuredFailure = (data) => {
  return {
    type: 'CLAIMS_COMPLEXITY_SEARCH_POST_FAILURE',
    payload: data,
  };
};
