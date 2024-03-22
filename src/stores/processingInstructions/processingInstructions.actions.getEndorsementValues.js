import * as utils from 'utils';
import { authLogout } from 'stores';
export const getEndorsementValues = (xbPolicyId, xbInstanceId) => (dispatch, getState) => {
  const {
    user: { auth },
    config: {
      vars: { endpoint },
    },
  } = getState();

  const endpointParams = {
    policyIds: xbPolicyId,
    instanceId: xbInstanceId,
  };

  return utils.api
    .get({
      token: auth.accessToken,
      endpoint: endpoint.ppService,
      path: 'risk/reference/endorsements',
      params: endpointParams,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((data) => utils.api.handleNewData(data))
    .then((json) => {
      dispatch(getEndorsementSuccess(json.data));
      return json.data;
    })
    .catch((error) => {
      dispatch(
        getEndorsementError(error, {
          file: 'stores/processingInstructions.actions.getEndorsementValues',
        })
      );
      utils.api.handleUnauthorized(error, dispatch, authLogout);
      return error;
    });
};

export const getEndorsementSuccess = (endorsementValues) => {
  return {
    type: 'PROCESSING_INSTRUCTIONS_REF_DATA_ENDORSEMENT_SUCCESS',
    payload: endorsementValues,
  };
};

export const getEndorsementError = (error) => {
  return {
    type: 'PROCESSING_INSTRUCTIONS_REF_DATA_ENDORSEMENT_ERROR',
    payload: error,
  };
};
