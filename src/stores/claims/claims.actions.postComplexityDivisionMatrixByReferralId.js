import get from 'lodash/get';

import { addLoader, removeLoader, enqueueNotification, getComplexityReferralValues, authLogout } from 'stores';
import * as utils from 'utils';

export const postComplexityDivisionMatrixByReferralId = (updatedMatrixData) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint } }, claims } = getState();

  const defaultError = {
    file: 'stores/claims.actions.postComplexityDivisionMatrixByReferralId',
  };

  const complexRuleValueObj = get(claims, 'complexityManagement.complexityReferralValueId');
  const complexRuleValueId = complexRuleValueObj.complexityRulesID;
  const complexityRuleValue = complexRuleValueObj.complexityRulesValue;

  const payload = {
    complexDivisions: utils.generic.isValidArray(updatedMatrixData) ? updatedMatrixData : [],
    referralRuleValue: complexityRuleValue || '',
  };

  dispatch(postComplexityDivisionMatrixByReferralIdRequest(updatedMatrixData));
  dispatch(addLoader('postComplexityDivisionMatrixByReferralId'));

  return utils.api
    .post({
      token: auth.accessToken,
      endpoint: endpoint.claimService,
      path: `api/data/claims-triage/complex/referral-values/${complexRuleValueId}/division-matrix`,
      data: payload,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleNewData(json, true))
    .then((data) => {
      dispatch(enqueueNotification('notification.complexityReferralDivision.success', 'success'));
      dispatch(getComplexityReferralValues());
      return data;
    })
    .catch((err) => {
      dispatch(postComplexityDivisionMatrixByReferralIdFailure(err, defaultError));
      dispatch(enqueueNotification('notification.complexityReferralDivision.fail', 'error'));
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      return err;
    })
    .finally(() => {
      dispatch(removeLoader('postComplexityDivisionMatrixByReferralId'));
    });
};

export const postComplexityDivisionMatrixByReferralIdRequest = (updatedMatrixData) => {
  return {
    type: 'CLAIMS_COMPLEXITY_DIVISION_BY_REFERRAL_ID_SAVE_REQUEST',
    payload: updatedMatrixData,
  };
};

export const postComplexityDivisionMatrixByReferralIdFailure = (err) => {
  return {
    type: 'CLAIMS_COMPLEXITY_DIVISION_BY_REFERRAL_ID_SAVE_FAILURE',
    payload: err,
  };
};
