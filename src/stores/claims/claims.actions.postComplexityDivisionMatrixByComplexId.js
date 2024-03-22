import get from 'lodash/get';

import { addLoader, removeLoader, enqueueNotification, getComplexityBasisValue, authLogout } from 'stores';
import * as utils from 'utils';

export const postComplexityDivisionMatrixByComplexId = (updatedMatrixData) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint } }, claims } = getState();

  const defaultError = {
    file: 'stores/claims.actions.postComplexityDivisionMatrixByComplexId',
  };

  const complexRuleValueObj = get(claims, 'complexityManagement.complexityBasisValueId');
  const complexRuleValueId = complexRuleValueObj.complexityRulesID;
  const complexityIsComplex = complexRuleValueObj.isComplex;
  const complexityRuleValue = complexRuleValueObj.complexityRulesValue;

  const payload = {
    complexDivisions: utils.generic.isValidArray(updatedMatrixData) ? updatedMatrixData : [],
    complexityRuleValue: complexityRuleValue || '',
  };

  dispatch(postComplexityDivisionMatrixByComplexIdRequest(updatedMatrixData));
  dispatch(addLoader('postComplexityDivisionMatrixByComplexId'));

  return utils.api
    .post({
      token: auth.accessToken,
      endpoint: endpoint.claimService,
      path: `api/data/claims-triage/complex/complex-values/${complexRuleValueId}/division-matrix?isComplex=${complexityIsComplex}`,
      data: payload,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleNewData(json, true))
    .then((data) => {
      dispatch(enqueueNotification('notification.complexityBasisDivision.success', 'success'));
      dispatch(getComplexityBasisValue());
      return data;
    })
    .catch((err) => {
      dispatch(postComplexityDivisionMatrixByComplexIdFailure(err, defaultError));
      dispatch(enqueueNotification('notification.complexityBasisDivision.fail', 'error'));
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      return err;
    })
    .finally(() => {
      dispatch(removeLoader('postComplexityDivisionMatrixByComplexId'));
    });
};

export const postComplexityDivisionMatrixByComplexIdRequest = (updatedMatrixData) => {
  return {
    type: 'CLAIMS_COMPLEXITY_DIVISION_BY_COMPLEX_ID_SAVE_REQUEST',
    payload: updatedMatrixData,
  };
};

export const postComplexityDivisionMatrixByComplexIdFailure = (err) => {
  return {
    type: 'CLAIMS_COMPLEXITY_DIVISION_BY_COMPLEX_ID_SAVE_FAILURE',
    payload: err,
  };
};
