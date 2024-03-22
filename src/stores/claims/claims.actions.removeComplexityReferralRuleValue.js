import get from 'lodash/get';

import { addLoader, removeLoader, enqueueNotification, getComplexityReferralValues, authLogout } from 'stores';
import * as utils from 'utils';

export const removeComplexityReferralRuleValue = (updatedMatrixData) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint } }, claims } = getState();

  const defaultError = {
    file: 'stores/claims.actions.removeComplexityReferralRuleValue',
  };

  const complexRuleValueId = get(claims, 'complexityManagement.complexityReferralValueId').complexityRulesID;

  dispatch(removeComplexityReferralRuleValueRequest(updatedMatrixData));
  dispatch(addLoader('removeComplexityReferralRuleValue'));

  return utils.api
    .delete({
      token: auth.accessToken,
      endpoint: endpoint.claimService,
      path: `api/data/claims-triage/complex/referral-values/${complexRuleValueId}/remove`,
      data: updatedMatrixData,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleNewData(json))
    .then((data) => {
      dispatch(removeComplexityReferralRuleValueSuccess());
      dispatch(enqueueNotification('notification.removeReferral.success', 'success'));
      dispatch(getComplexityReferralValues());
      return data;
    })
    .catch((err) => {
      dispatch(removeComplexityReferralRuleValueFailure(err, defaultError));
      dispatch(enqueueNotification('notification.removeReferral.fail', 'error'));
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      return err;
    })
    .finally(() => {
      dispatch(removeLoader('removeComplexityReferralRuleValue'));
    });
};

export const removeComplexityReferralRuleValueRequest = (updatedMatrixData) => {
  return {
    type: 'CLAIMS_REMOVE_REFERRAL_VALUES_REQUEST',
    payload: updatedMatrixData,
  };
};

export const removeComplexityReferralRuleValueSuccess = () => {
  return {
    type: 'CLAIMS_REMOVE_REFERRAL_VALUES_SUCCESS',
  };
};

export const removeComplexityReferralRuleValueFailure = (err) => {
  return {
    type: 'CLAIMS_REMOVE_REFERRAL_VALUES_FAILURE',
    payload: err,
  };
};
