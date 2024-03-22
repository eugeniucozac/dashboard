import { authLogout, addLoader, removeLoader } from 'stores';
import * as utils from 'utils';
import get from 'lodash/get';

export const getInterest = (params) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint } } } = getState();

  const defaultError = {
    file: 'stores/claims.actions.getInterest',
  };

  const state = getState();
  const policyData = get(state, 'claims.policyData') || '';
  const viewLoader = params?.viewLoader ?? false;
  dispatch(getInterestRequest());
  viewLoader && dispatch(addLoader('getInterest'));

  return utils.api
    .get({
      token: auth.accessToken,
      endpoint: endpoint.claimService,
      path: `api/data/policy/${policyData.xbPolicyID}/source/${policyData.xbInstanceID}/interests`,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((data) => {
      dispatch(getInterestSuccess(data.data));
      return data.data;
    })
    .catch((err) => {
      dispatch(getInterestFailure(err, defaultError));
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      return err;
    })
    .finally(() => {
      viewLoader && dispatch(removeLoader('getInterest'));
    });
};

export const getInterestRequest = (data) => {
  return {
    type: 'CLAIMS_SELECT_INTEREST_GET_REQUEST',
    payload: data,
  };
};

export const getInterestSuccess = (data) => {
  return {
    type: 'CLAIMS_SELECT_INTEREST_GET_SUCCESS',
    payload: data,
  };
};

export const getInterestFailure = (data) => {
  return {
    type: 'CLAIMS_SELECT_INTEREST_GET_FAILURE',
    payload: data,
  };
};

export const setInterestValue = (data) => {
  return {
    type: 'CLAIMS_SELECT_INTEREST_VALUE',
    payload: data,
  };
};
