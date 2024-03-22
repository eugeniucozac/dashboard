import get from 'lodash/get';

// app
import { addLoader, authLogout, enqueueNotification, removeLoader } from 'stores';
import * as utils from 'utils';

export const removeComplexityInsured = (data) => (dispatch, getState) => {
  // prettier-ignore
  const state = getState();
  const {
    user: { auth },
    config: {
      vars: { endpoint },
    },
  } = state;

  const defaultError = {
    file: 'stores/claims.actions.removeComplexityInsured',
  };

  const complexityInsured = get(state, 'claims.insured');
  const checkedInsured = Object.keys(Object.fromEntries(Object.entries(data).filter(([key, value]) => value)));

  const selectedIndex = complexityInsured?.items?.findIndex((item) => item.insured.split('.').join('') === checkedInsured[0]);

  const mappedInsured = checkedInsured.map((item) => ({
    attributeType: 'Insured',
    attributeValue: complexityInsured?.items[selectedIndex]?.insured,
    complexityAttributesID: 0,
    isActive: 0,
    isComplex: 1,
    sourceID: 1,
  }));

  dispatch(removeComplexityInsuredRequest(mappedInsured));
  dispatch(addLoader('removeComplexityInsured'));

  return utils.api
    .put({
      token: auth.accessToken,
      endpoint: endpoint.claimService,
      path: 'api/data/claims-triage/complex/insured/update',
      data: mappedInsured,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleNewData(json))
    .then((data) => {
      dispatch(removeLoader('removeComplexityInsured'));
      dispatch(enqueueNotification('notification.policyRemove.remove.success', 'success'));
    })
    .catch((err) => {
      dispatch(removeComplexityInsuredFailure(err, defaultError));
      dispatch(removeLoader('removeComplexityInsured'));
      dispatch(enqueueNotification('notification.policyRemove.remove.fail', 'error'));
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      return err;
    });
};

export const removeComplexityInsuredRequest = (payload) => {
  return {
    type: 'CLAIMS_COMPLEXITY_POLICY_REMOVE_REQUEST',
    payload,
  };
};

export const removeComplexityInsuredSuccess = (payload) => {
  return {
    type: 'CLAIMS_COMPLEXITY_POLICY_REMOVE_SUCCESS',
    payload,
  };
};

export const removeComplexityInsuredFailure = (error) => {
  return {
    type: 'CLAIMS_COMPLEXITY_POLICY_REMOVE_FAILURE',
    payload: error,
  };
};
