import { authLogout, addLoader, removeLoader } from 'stores';
import * as utils from 'utils';
import get from 'lodash/get';

export const getClaimDetails = (params) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}, claims} = getState();

  const defaultError = {
    file: 'stores/claims.actions.getClaimDetails',
  };

  const xbPolicyId = get(claims, 'policyData.xbPolicyID') || '';
  const xbInstanceId = get(claims, 'policyData.xbInstanceID') || '';
  const lossDetailsId = get(claims, 'lossInformation.lossDetailID') || '';
  const viewLoader = params?.viewLoader ?? false;

  dispatch(getClaimDetailsRequest());
  viewLoader && dispatch(addLoader('getClaimDetails'));

  return utils.api
    .get({
      token: auth.accessToken,
      endpoint: endpoint.claimService,
      path: `api/data/claims/new-claim?xbPolicyID=${xbPolicyId}&xbInstanceID=${xbInstanceId}&lossDetailsId=${lossDetailsId}`,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((data) => {
      dispatch(getClaimDetailsSuccess(data.data));
      viewLoader && dispatch(removeLoader('getClaimDetails'));
      return data;
    })
    .catch((err) => {
      dispatch(getClaimDetailsFailure(err, defaultError));
      viewLoader && dispatch(removeLoader('getClaimDetails'));
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      return err;
    });
};

export const getClaimDetailsRequest = (data) => {
  return {
    type: 'CLAIMS_DETAILS_REQUEST',
    payload: data,
  };
};

export const getClaimDetailsSuccess = (data) => {
  return {
    type: 'CLAIMS_DETAILS_SUCCESS',
    payload: data,
  };
};

export const getClaimDetailsFailure = (data) => {
  return {
    type: 'CLAIMS_DETAILS_ERROR',
    payload: data,
  };
};
