import { authLogout, addLoader, removeLoader } from 'stores';
import * as utils from 'utils';

export const getComplexityDivisionMatrixByReferralId = (referralRuleValueId) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint } } } = getState();

  const defaultError = {
    file: 'stores/claims.actions.getComplexityDivisionMatrixByReferralId',
  };

  dispatch(getComplexityDivisionMatrixByReferralIdRequest(referralRuleValueId));
  dispatch(addLoader('getComplexityDivisionMatrixByReferralId'));

  return utils.api
    .get({
      token: auth.accessToken,
      endpoint: endpoint.claimService,
      path: `api/data/claims-triage/complex/referral-values/${referralRuleValueId}/division-matrix`,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleNewData(json))
    .then((data) => {
      dispatch(getComplexityDivisionMatrixByReferralIdSuccess(data.data));
      return data.data;
    })
    .catch((err) => {
      dispatch(getComplexityDivisionMatrixByReferralIdFailure(err, defaultError));
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      return err;
    })
    .finally(() => {
      dispatch(removeLoader('getComplexityDivisionMatrixByReferralId'));
    });
};

export const getComplexityDivisionMatrixByReferralIdRequest = (referralRuleValueId) => {
  return {
    type: 'CLAIMS_COMPLEXITY_DIVISION_BY_REFERRAL_ID_GET_REQUEST',
    payload: referralRuleValueId,
  };
};

export const getComplexityDivisionMatrixByReferralIdSuccess = (data) => {
  return {
    type: 'CLAIMS_COMPLEXITY_DIVISION_BY_REFERRAL_ID_GET_SUCCESS',
    payload: data,
  };
};

export const getComplexityDivisionMatrixByReferralIdFailure = (err) => {
  return {
    type: 'CLAIMS_COMPLEXITY_DIVISION_BY_REFERRAL_ID_GET_FAILURE',
    payload: err,
  };
};
