import get from 'lodash/get';

import { addLoader, removeLoader, enqueueNotification, getComplexityBasisValue, authLogout } from 'stores';
import * as utils from 'utils';

export const removeComplexityBasisRuleValue = (updatedMatrixData) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint } }, claims } = getState();

  const defaultError = {
    file: 'stores/claims.actions.removeComplexityBasisRuleValue',
  };

  const complexRuleValueId = get(claims, 'complexityManagement.complexityBasisValueId').complexityRulesID;

  dispatch(removeComplexityBasisRuleValueRequest(updatedMatrixData));
  dispatch(addLoader('removeComplexityBasisRuleValue'));

  return utils.api
    .delete({
      token: auth.accessToken,
      endpoint: endpoint.claimService,
      path: `api/data/claims-triage/complex/complex-values/${complexRuleValueId}/remove`,
      data: updatedMatrixData,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleNewData(json))
    .then((data) => {
      dispatch(removeComplexityBasisRuleValueSuccess());
      dispatch(enqueueNotification('notification.removeComplexityValue.success', 'success'));
      dispatch(getComplexityBasisValue());
      return data;
    })
    .catch((err) => {
      dispatch(removeComplexityBasisRuleValueFailure(err, defaultError));
      dispatch(enqueueNotification('notification.removeComplexityValue.fail', 'error'));
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      return err;
    })
    .finally(() => {
      dispatch(removeLoader('removeComplexityBasisRuleValue'));
    });
};

export const removeComplexityBasisRuleValueRequest = (updatedMatrixData) => {
  return {
    type: 'CLAIMS_REMOVE_COMPLEXITY_VALUES_REQUEST',
    payload: updatedMatrixData,
  };
};

export const removeComplexityBasisRuleValueSuccess = () => {
  return {
    type: 'CLAIMS_REMOVE_COMPLEXITY_VALUES_SUCCESS',
  };
};

export const removeComplexityBasisRuleValueFailure = (err) => {
  return {
    type: 'CLAIMS_REMOVE_COMPLEXITY_VALUES_FAILURE',
    payload: err,
  };
};
