import { authLogout, addLoader, removeLoader } from 'stores';
import * as utils from 'utils';
import get from 'lodash/get';

export const getClaimBordereauPeriods = (params) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}, claims} = getState();

  const defaultError = {
    file: 'stores/claims.actions.getClaimBordereauPeriods',
  };

  const xbPolicyId = get(claims, 'policyData.xbPolicyID') || '';
  const xbInstanceId = get(claims, 'policyData.xbInstanceID') || '';

  const viewLoader = params?.viewLoader ?? true;

  dispatch(getClaimBordereauPeriodsRequest());
  viewLoader && dispatch(addLoader('getClaimBordereauPeriods'));

  return utils.api
    .get({
      token: auth.accessToken,
      endpoint: endpoint.claimService,
      path: `api/data/gui/policy/${xbPolicyId}/source/${xbInstanceId}/BordereauPeriod`,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleNewData(json))
    .then((data) => {
      dispatch(getClaimBordereauPeriodsSuccess(data.data));
      return data.data;
    })
    .catch((err) => {
      dispatch(getClaimBordereauPeriodsFailure(err, defaultError));
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      return err;
    })
    .finally(() => {
      viewLoader && dispatch(removeLoader('getClaimBordereauPeriods'));
    });
};

export const getClaimBordereauPeriodsRequest = () => {
  return {
    type: 'CLAIMS_BORDEREAU_REQUEST',
  };
};

export const getClaimBordereauPeriodsSuccess = (data) => {
  return {
    type: 'CLAIMS_BORDEREAU_SUCCESS',
    payload: data,
  };
};

export const getClaimBordereauPeriodsFailure = (error) => {
  return {
    type: 'CLAIMS_BORDEREAU_ERROR',
    payload: error,
  };
};
