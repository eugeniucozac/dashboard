// app
import { addLoader, authLogout, enqueueNotification, removeLoader } from 'stores';
import * as utils from 'utils';
import get from 'lodash/get';

export const removeComplexityPolicy = (data) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint } }, claims } = getState();
  const getPoliciesData = get(claims, 'complexityPoliciesFlagged.items') || [];

  const defaultError = {
    file: 'stores/claims.actions.removeComplexityPolicy',
  };
  const checkedPolicies = Object.keys(Object.fromEntries(Object.entries(data).filter(([key, value]) => value)));
  const xbInstanceIDs = getPoliciesData?.filter((item) => checkedPolicies?.includes(item?.xbPolicyID?.toString()));

  const mappedPolicies = xbInstanceIDs?.map((item) => ({
    attributeType: 'Policy',
    attributeValue: item?.xbPolicyID?.toString(),
    complexityAttributesID: 0,
    isActive: 0,
    isComplex: 1,
    sourceID: item?.xbInstanceID?.toString(),
  }));

  dispatch(removeComplexityPolicyRequest(mappedPolicies));
  dispatch(addLoader('removeComplexityPolicy'));

  return utils.api
    .put({
      token: auth.accessToken,
      endpoint: endpoint.claimService,
      path: 'api/data/claims-triage/complex/policy/update',
      data: mappedPolicies,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleNewData(json))
    .then((data) => {
      dispatch(enqueueNotification('notification.policyRemove.remove.success', 'success'));
      dispatch(removeLoader('removeComplexityPolicy'));
    })
    .catch((err) => {
      dispatch(removeComplexityPolicyFailure(err, defaultError));
      dispatch(enqueueNotification('notification.policyRemove.remove.fail', 'error'));
      dispatch(removeLoader('removeComplexityPolicy'));
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      return err;
    });
};

export const removeComplexityPolicyRequest = (payload) => {
  return {
    type: 'CLAIMS_COMPLEXITY_INSURED_REMOVE_REQUEST',
    payload,
  };
};

export const removeComplexityPolicySuccess = (payload) => {
  return {
    type: 'CLAIMS_COMPLEXITY_INSURED_REMOVE_SUCCESS',
    payload,
  };
};

export const removeComplexityPolicyFailure = (error) => {
  return {
    type: 'CLAIMS_COMPLEXITY_INSURED_REMOVE_FAILURE',
    payload: error,
  };
};
