import { addLoader, authLogout, removeLoader } from 'stores';
import * as utils from 'utils';

export const getPolicySections = (params) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint } }, claims: { policyData } } = getState();

  const defaultError = {
    component: 'getPolicySections',
    file: 'stores/claims.actions.getPolicySections',
  };
  const xbPolicyID = params?.xbPolicyID ?? false
  const xbInstanceID = params?.xbInstanceID ?? false
  const policyID = xbPolicyID ? xbPolicyID : policyData.xbPolicyID ? policyData.xbPolicyID : '';
  const sourceID = xbInstanceID ? xbInstanceID : policyData.xbInstanceID ? policyData.xbInstanceID : '';
  const viewLoader = params?.viewLoader ?? true
  dispatch(getPolicySectionsRequest());
  viewLoader && dispatch(addLoader('getPolicySections'));

  return utils.api
    .get({
      token: auth.accessToken,
      endpoint: endpoint.claimService,
      path: `api/data/gui/policy/${policyID}/source/${sourceID}/section`,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleNewData(json))
    .then((data) => {
      dispatch(getPolicySectionsSuccess(data.data));
      return data.data;
    })
    .catch((err) => {
      dispatch(getPolicySectionsFailure(err, defaultError));
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      return err;
    })
    .finally(() => {
      viewLoader && dispatch(removeLoader('getPolicySections'));
    });
};

export const getPolicySectionsRequest = () => {
  return {
    type: 'CLAIMS_POLICY_SECTIONS_GET_REQUEST',
  };
};

export const getPolicySectionsSuccess = (data) => {
  return {
    type: 'CLAIMS_POLICY_SECTIONS_GET_SUCCESS',
    payload: data,
  };
};

export const getPolicySectionsFailure = (err) => {
  return {
    type: 'CLAIMS_POLICY_SECTIONS_GET_FAILURE',
    payload: err,
  };
};
