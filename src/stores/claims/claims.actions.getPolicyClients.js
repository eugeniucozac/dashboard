import { authLogout, addLoader, removeLoader } from 'stores';
import * as utils from 'utils';
import get from 'lodash/get';

export const getPolicyClients = (params) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint } }, claims } = getState();

  const defaultError = {
    file: 'stores/claims.actions.getPolicyClients',
  };

  const xbPolicyId = get(claims, 'policyData.xbPolicyID') || '';
  const xbInstanceId = get(claims, 'policyData.xbInstanceID') || '';
  const viewLoader = params?.viewLoader ?? true

  dispatch(getPolicyClientsRequest());
  viewLoader && dispatch(addLoader('getPolicyClients'));

  return utils.api
    .get({
      token: auth.accessToken,
      endpoint: endpoint.claimService,
      path: `api/data/gui/policy/${xbPolicyId}/source/${xbInstanceId}/client`,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleNewData(json))
    .then((data) => {
      dispatch(getPolicyClientsSuccess(data.data));
      return data.data;
    })
    .catch((err) => {
      dispatch(getPolicyClientsFailure(err, defaultError));
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      return err;
    })
    .finally(() => {
      viewLoader && dispatch(removeLoader('getPolicyClients'));
    });
};

export const getPolicyClientsRequest = () => {
  return {
    type: 'CLAIMS_POLICY_CLIENTS_REQUEST',
  };
};

export const getPolicyClientsSuccess = (data) => {
  return {
    type: 'CLAIMS_POLICY_CLIENTS_SUCCESS',
    payload: data,
  };
};

export const getPolicyClientsFailure = (error) => {
  return {
    type: 'CLAIMS_POLICY_CLIENTS_ERROR',
    payload: error,
  };
};
