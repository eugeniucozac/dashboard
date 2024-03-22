import { authLogout, addLoader, removeLoader } from 'stores';
import * as utils from 'utils';
import get from 'lodash/get';

export const getComplexityValues =
  (divisionID, xbInstanceID, includeDefaultValues = true, sourceDepartments) =>
  (dispatch, getState) => {
    // prettier-ignore
    const { user: { auth }, config: { vars: { endpoint }}} = getState();

    const defaultError = {
      file: 'stores/claims.actions.getComplexityValues',
    };

    dispatch(getComplexityValuesRequest(divisionID, xbInstanceID, includeDefaultValues, sourceDepartments));
    dispatch(addLoader('getComplexityValues'));

    const state = getState();
    const policyData = get(state, 'claims.policyData') || '';
    const isMultipleSourceDepartments = Boolean(sourceDepartments);

    return utils.api
      .get({
        token: auth.accessToken,
        endpoint: endpoint.claimService,
        path: 'api/data/claims-triage/complex/complexity-values',
        params: {
          ...(isMultipleSourceDepartments
            ? { sourceDepartments }
            : {
                departmentID: policyData?.divisionID ?? divisionID,
                xbInstanceID: policyData?.xbInstanceID ?? xbInstanceID,
              }),
          includeDefaultValues,
        },
      })
      .then((response) => utils.api.handleResponse(response))
      .then((data) => {
        dispatch(getComplexityValuesSuccess(data.data));
        dispatch(removeLoader('getComplexityValues'));
        return data.data;
      })
      .catch((err) => {
        dispatch(getComplexityValuesFailure(err, defaultError));
        dispatch(removeLoader('getComplexityValues'));
        utils.api.handleUnauthorized(err, dispatch, authLogout);
        return err;
      });
  };

export const getComplexityValuesRequest = (divisionID, xbInstanceID, includeDefaultValues) => {
  return {
    type: 'CLAIMS_COMPLEXITY_VALUES_GET_REQUEST',
    payload: { divisionID, xbInstanceID, includeDefaultValues },
  };
};

export const getComplexityValuesSuccess = (data) => {
  return {
    type: 'CLAIMS_COMPLEXITY_VALUES_GET_SUCCESS',
    payload: data,
  };
};

export const getComplexityValuesFailure = (data) => {
  return {
    type: 'CLAIMS_COMPLEXITY_VALUES_GET_FAILURE',
    payload: data,
  };
};
