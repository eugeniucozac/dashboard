import { authLogout, addLoader, removeLoader } from 'stores';
import * as utils from 'utils';
import get from 'lodash/get';

export const getPolicyInformation = (params) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint } } } = getState();

  const defaultError = {
    file: 'stores/claims.actions.getPolicyInformation',
  };

  const state = getState();
  const policyData = get(state, 'claims.policyData') || {};
  const claimInformation = get(state, 'claims.claimsInformation') || {};
  const policyId = params?.xbPolicyID || policyData?.xbPolicyID || claimInformation?.policyID || '';
  const instanceId = params?.xbInstanceID || policyData?.xbInstanceID || claimInformation?.sourceID || '';
  const viewLoader = params?.viewLoader ?? false;
  dispatch(getPolicyInformationRequest());
  viewLoader && dispatch(addLoader('getPolicyInformation'));

  if (!policyId || !instanceId) {
    dispatch(getPolicyInformationFailure({ ...defaultError, message: 'Missing requests params' }));
    dispatch(removeLoader('getPolicyInformation'));
    return;
  }

  return utils.api
    .get({
      token: auth.accessToken,
      endpoint: endpoint.claimService,
      path: `api/data/policy/${policyId}/source/${instanceId}/details`,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((data) => {
      dispatch(getPolicyInformationSuccess(data.data));
      return data.data;
    })
    .catch((err) => {
      dispatch(getPolicyInformationFailure(err, defaultError));
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      return err;
    })
    .finally(() => {
      viewLoader && dispatch(removeLoader('getPolicyInformation'));
    });
};

export const getPolicyInformationRequest = () => {
  return {
    type: 'CLAIMS_POLICY_INFORMATION_GET_REQUEST',
  };
};

export const getPolicyInformationSuccess = (data) => {
  return {
    type: 'CLAIMS_POLICY_INFORMATION_GET_SUCCESS',
    payload: data,
  };
};

export const getPolicyInformationFailure = (error) => {
  return {
    type: 'CLAIMS_POLICY_INFORMATION_GET_FAILURE',
    payload: error,
  };
};
