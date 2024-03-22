import * as utils from 'utils';
import { authLogout } from 'stores';

export const getBordereauPolicyTypes = () => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}} = getState();

  const defaultError = {
    file: 'stores/processingInstructions.actions.getBordereauPolicyTypes',
  };

  dispatch(getBordereauPolicyTypesRequest());

  return utils.api
    .get({
      token: auth.accessToken,
      endpoint: endpoint.odsService,
      path: `referenceData/BordereauPolicyType`,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => {
      if (json && json.status === 'OK' && json.data) {
        // success
        dispatch(getBordereauPolicyTypesSuccess(json.data.bordereauPolicyType));
        return json.data.bordereauPolicyType;
      } else {
        // fail
        return Promise.reject({
          message: `API data format error${json.status ? ` (${json.status})` : ''}`,
          ...(json && { ...json }),
        });
      }
    })
    .catch((err) => {
      utils.api.handleError(err, { ...defaultError, message: 'API fetch error (processingInstructions.getBordereauPolicyTypes)' });
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(getBordereauPolicyTypesFailure(err));
      return err;
    });
};

export const getBordereauPolicyTypesRequest = (payload) => {
  return {
    type: 'PROCESSING_INSTRUCTIONS_GET_BORDEREAU_POLICY_TYPES_REQUEST',
    payload,
  };
};

export const getBordereauPolicyTypesSuccess = (responseData) => {
  return {
    type: 'PROCESSING_INSTRUCTIONS_GET_BORDEREAU_POLICY_TYPES_SUCCESS',
    payload: responseData,
  };
};

export const getBordereauPolicyTypesFailure = (error) => {
  return {
    type: 'PROCESSING_INSTRUCTIONS_GET_BORDEREAU_POLICY_TYPES_FAILURE',
    payload: error,
  };
};
