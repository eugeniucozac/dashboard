import { addLoader, removeLoader, enqueueNotification, savedInsuredData, authLogout } from 'stores';
import * as utils from 'utils';
import get from 'lodash/get';

export const postSaveComplexityAddInsured = () => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}, claims} = getState();

  const defaultError = {
    file: 'stores/claims.actions.postSaveComplexityAddInsured',
  };

  dispatch(postSaveComplexityAddInsuredRequest());
  dispatch(addLoader('postSaveComplexityInsuredPolicy'));

  const insuredData = [],
    selectedInsuredData = [];
  const getInsuredData = get(claims, 'complexInsured.selectedComplexityInsured') || [];
  getInsuredData.forEach((item) => {
    if (item.checkedType) {
      insuredData.push({
        isActive: '1',
        policyID: item.insured.xbPolicyID,
        sourceID: item.insured.xbInstanceID,
        attributeType: 'insured',
        attributeValue: item.insured.attributeValue,
      });
      selectedInsuredData.push(item.insured);
    }
  });

  const data = insuredData;
  dispatch(savedInsuredData(selectedInsuredData));

  return utils.api
    .post({
      token: auth.accessToken,
      endpoint: endpoint.claimService,
      path: 'api/data/claims-triage/complex/insured/save',
      data,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((data) => {
      dispatch(postSaveComplexityAddInsuredSuccess(data.data));
      dispatch(enqueueNotification('notification.complexityInsuredInformation.success', 'success'));
      return data;
    })
    .catch((err) => {
      dispatch(postSaveComplexityAddInsuredFailure(err, defaultError));
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      return err;
    })
    .finally(() => {
      dispatch(removeLoader('postSaveComplexityInsuredPolicy'));
    });
};

export const postSaveComplexityAddInsuredRequest = (data) => {
  return {
    type: 'CLAIMS_SAVE_COMPLEXITY_POLICY_POST_REQUEST',
    payload: data,
  };
};

export const postSaveComplexityAddInsuredSuccess = (data) => {
  return {
    type: 'CLAIMS_SAVE_COMPLEXITY_INSURED_POST_SUCCESS',
    payload: data,
  };
};

export const postSaveComplexityAddInsuredFailure = (data) => {
  return {
    type: 'CLAIMS_SAVE_COMPLEXITY_INSURED_POST_ERROR',
    payload: data,
  };
};
