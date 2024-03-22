import { authLogout, addLoader, removeLoader } from 'stores';
import * as utils from 'utils';
import get from 'lodash/get';

export const getPolicyInsures = (params) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint } }, claims } = getState();

  const defaultError = {
    file: 'stores/claims.actions.getPolicyInsures',
  };

  const xbPolicyId = get(claims, 'policyData.xbPolicyID') || '';
  const xbInstanceId = get(claims, 'policyData.xbInstanceID') || '';
  const viewLoader = params?.viewLoader ?? true

  dispatch(getPolicyInsuresRequest());
  viewLoader && dispatch(addLoader('getPolicyInsures'));

  return utils.api
    .get({
      token: auth.accessToken,
      endpoint: endpoint.claimService,
      path: `api/data/gui/policy/${xbPolicyId}/source/${xbInstanceId}/insured`,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleNewData(json))
    .then((data) => {
      dispatch(getPolicyInsuresSuccess(data.data));
      return data.data;
    })
    .catch((err) => {
      dispatch(getPolicyInsuresFailure(err, defaultError));
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      return err;
    })
    .finally(() => {
      viewLoader && dispatch(removeLoader('getPolicyInsures'));
    });
};

export const getPolicyInsuresRequest = () => {
  return {
    type: 'CLAIMS_POLICY_INSURED_REQUEST',
  };
};

export const getPolicyInsuresSuccess = (data) => {
  return {
    type: 'CLAIMS_POLICY_INSURED_SUCCESS',
    payload: data,
  };
};

export const getPolicyInsuresFailure = (error) => {
  return {
    type: 'CLAIMS_POLICY_INSURED_ERROR',
    payload: error,
  };
};
