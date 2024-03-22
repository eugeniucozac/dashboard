import { addLoader, removeLoader, enqueueNotification, authLogout } from 'stores';
import * as utils from 'utils';
import get from 'lodash/get';

export const postSaveComplexityAddPolicy = () => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}, claims} = getState();

  const defaultError = {
    file: 'stores/claims.actions.postSaveComplexityAddPolicy',
  };

  dispatch(postSaveComplexityAddPolicyRequest());
  dispatch(addLoader('postSaveComplexityAddPolicy'));

  const policiesData = [];
  const getPoliciesData = get(claims, 'complexityPolicies.selectedComplexityPolicies') || [];

  getPoliciesData.forEach((item) => {
    if (item.checkedType) {
      policiesData.push({
        attributeType: 'Policy',
        attributeValue: item.policy.attributeValue,
        complexityAttributesID: 0,
        isActive: 1,
        isComplex: 1,
        sourceID: item.policy.xbInstanceID,
      });
    }
  });

  return utils.api
    .post({
      token: auth.accessToken,
      endpoint: endpoint.claimService,
      path: 'api/data/claims-triage/complex/policy/save',
      data: policiesData,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((data) => {
      dispatch(postSaveComplexityAddPolicySuccess(data.data));
      dispatch(enqueueNotification('notification.complexityPolicyInformation.success', 'success'));
      return data;
    })
    .catch((err) => {
      dispatch(postSaveComplexityAddPolicyFailure(err, defaultError));
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      return err;
    })
    .finally(() => {
      dispatch(removeLoader('postSaveComplexityAddPolicy'));
    });
};

export const postSaveComplexityAddPolicyRequest = (data) => {
  return {
    type: 'CLAIMS_SAVE_COMPLEXITY_POLICY_POST_REQUEST',
    payload: data,
  };
};

export const postSaveComplexityAddPolicySuccess = (data) => {
  return {
    type: 'CLAIMS_SAVE_COMPLEXITY_POLICY_POST_SUCCESS',
    payload: data,
  };
};

export const postSaveComplexityAddPolicyFailure = (data) => {
  return {
    type: 'CLAIMS_SAVE_COMPLEXITY_POLICY_POST_ERROR',
    payload: data,
  };
};
