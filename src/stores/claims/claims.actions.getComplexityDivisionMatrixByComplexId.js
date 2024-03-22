import { authLogout, addLoader, removeLoader } from 'stores';
import * as utils from 'utils';

export const getComplexityDivisionMatrixByComplexId = (complexRuleValueId) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint } } } = getState();

  const defaultError = {
    file: 'stores/claims.actions.getComplexityDivisionMatrixByComplexId',
  };

  dispatch(getComplexityDivisionMatrixByComplexIdRequest(complexRuleValueId));
  dispatch(addLoader('getComplexityDivisionMatrixByComplexId'));

  return utils.api
    .get({
      token: auth.accessToken,
      endpoint: endpoint.claimService,
      path: `api/data/claims-triage/complex/complex-values/${complexRuleValueId}/division-matrix`,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleNewData(json))
    .then((data) => {
      dispatch(getComplexityDivisionMatrixByComplexIdSuccess(data.data));
      return data.data;
    })
    .catch((err) => {
      dispatch(getComplexityDivisionMatrixByComplexIdFailure(err, defaultError));
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      return err;
    })
    .finally(() => {
      dispatch(removeLoader('getComplexityDivisionMatrixByComplexId'));
    });
};

export const getComplexityDivisionMatrixByComplexIdRequest = (complexRuleValueId) => {
  return {
    type: 'CLAIMS_COMPLEXITY_DIVISION_BY_COMPLEX_ID_GET_REQUEST',
    payload: complexRuleValueId,
  };
};

export const getComplexityDivisionMatrixByComplexIdSuccess = (data) => {
  return {
    type: 'CLAIMS_COMPLEXITY_DIVISION_BY_COMPLEX_ID_GET_SUCCESS',
    payload: data,
  };
};

export const getComplexityDivisionMatrixByComplexIdFailure = (err) => {
  return {
    type: 'CLAIMS_COMPLEXITY_DIVISION_BY_COMPLEX_ID_GET_FAILURE',
    payload: err,
  };
};
