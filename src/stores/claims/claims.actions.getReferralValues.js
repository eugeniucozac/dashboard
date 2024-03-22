import { addLoader, authLogout, removeLoader } from 'stores';
import * as utils from 'utils';
import get from 'lodash/get';

export const getReferralValues = () => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}} = getState();

  const defaultError = {
    file: 'stores/claims.actions.getReferralValues',
  };

  dispatch(getReferralValuesRequest());
  dispatch(addLoader('getReferralValues'));

  const state = getState();
  const policyData = get(state, 'claims.policyData') || '';

  return utils.api
    .get({
      token: auth.accessToken,
      endpoint: endpoint.claimService,
      path: `api/data/claims-triage/complex/referral-values?departmentID=${policyData.divisionID}&xbInstanceID=${policyData.xbInstanceID}`,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((data) => {
      dispatch(getReferralValuesSuccess(data.data));
      dispatch(removeLoader('getReferralValues'));
      return data.data;
    })
    .catch((err) => {
      dispatch(getReferralValuesFailure(err, defaultError));
      dispatch(removeLoader('getReferralValues'));
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      return err;
    });
};

export const getReferralValuesRequest = (data) => {
  return {
    type: 'CLAIMS_REFERRAL_VALUES_GET_REQUEST',
    payload: data,
  };
};

export const getReferralValuesSuccess = (data) => {
  return {
    type: 'CLAIMS_REFERRAL_VALUES_GET_SUCCESS',
    payload: data,
  };
};

export const getReferralValuesFailure = (data) => {
  return {
    type: 'CLAIMS_REFERRAL_VALUES_GET_FAILURE',
    payload: data,
  };
};
