import get from 'lodash/get';

import { authLogout, addLoader, removeLoader, enqueueNotification } from 'stores';
import * as utils from 'utils';
import * as constants from 'consts';

export const getComplexityReferralValues = (params) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint } }, claims } = getState();

  const defaultError = {
    file: 'stores/claims.actions.getComplexityReferralValues',
  };

  dispatch(getComplexityReferralValuesRequest());
  dispatch(addLoader('getComplexityReferralValues'));

  const prevDirection = get(claims, 'complexityReferralValues.sort.direction') || '';
  const newDirection = params?.hasOwnProperty('direction') ? params.direction : prevDirection;

  const prevQuery = get(claims, 'complexityReferralValues.query') || '';
  const newQuery = params?.hasOwnProperty('term') ? params.term : prevQuery;

  const prevSortBy = get(claims, 'complexityReferralValues.sort.by') || '';
  const newSortBy = params?.hasOwnProperty('sortBy') ? params.sortBy : prevSortBy;

  const data = {
    direction: newDirection,
    page: (params && params.page) || 0,
    pageSize: (params && params.size) || claims.complexityReferralValues.pageSize,
    search: newQuery,
    sortBy: newSortBy,
    filterLossClaimsCriteriaDTO: {},
  };

  return utils.api
    .post({
      token: auth.accessToken,
      endpoint: endpoint.claimService,
      path: 'api/data/claims-triage/complex/referral-values/search',
      data,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleNewData(json))
    .then((data) => {
      dispatch(getComplexityReferralValuesSuccess(data));
      return data;
    })
    .catch((err) => {
      dispatch(getComplexityReferralValuesFailure(err, defaultError));
      dispatch(
        err?.response?.status === constants.API_STATUS_NOT_FOUND
          ? enqueueNotification('notification.getReferralValues.notFound', 'error')
          : enqueueNotification('notification.getReferralValues.fail', 'error')
      );
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      return err;
    })
    .finally(() => {
      dispatch(removeLoader('getComplexityReferralValues'));
    });
};

export const getComplexityReferralValuesRequest = (params) => {
  return {
    type: 'CLAIMS_COMPLEXITY_REFERRAL_VALUES_GET_REQUEST',
    payload: params,
  };
};

export const getComplexityReferralValuesSuccess = (data) => {
  return {
    type: 'CLAIMS_COMPLEXITY_REFERRAL_VALUES_GET_SUCCESS',
    payload: data,
  };
};

export const getComplexityReferralValuesFailure = (err) => {
  return {
    type: 'CLAIMS_COMPLEXITY_REFERRAL_VALUES_GET_FAILURE',
    payload: err,
  };
};
