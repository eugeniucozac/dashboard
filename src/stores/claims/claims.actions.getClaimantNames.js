import get from 'lodash/get';
import { authLogout, addLoader, removeLoader } from 'stores';
import * as utils from 'utils';

export const getClaimantNames = () => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}} = getState();

  const defaultError = {
    file: 'stores/claims.actions.getClaimantNames',
  };

  const state = getState();
  const policyRef = get(state, 'claims.policyData.policyNumber') || '';

  dispatch(getClaimantNamesRequest());
  dispatch(addLoader('getClaimantNames'));

  return utils.api
    .get({
      token: auth.accessToken,
      endpoint: endpoint.claimService,
      path: `api/data/gui/policy/${policyRef}/claimant-names`,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((data) => {
      dispatch(getClaimantNamesSuccess(data.data));
      dispatch(removeLoader('getClaimantNames'));
      return data.data;
    })
    .catch((err) => {
      dispatch(getClaimantNamesFailure(err, defaultError));
      dispatch(removeLoader('getClaimantNames'));
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      return err;
    });
};

export const getClaimantNamesRequest = (data) => {
  return {
    type: 'CLAIMS_CLAIMANT_NAMES_GET_REQUEST',
    payload: data,
  };
};

export const getClaimantNamesSuccess = (data) => {
  return {
    type: 'CLAIMS_CLAIMANT_NAMES_GET_SUCCESS',
    payload: data,
  };
};

export const getClaimantNamesFailure = (data) => {
  return {
    type: 'CLAIMS_CLAIMANT_NAMES_GET_FAILURE',
    payload: data,
  };
};
