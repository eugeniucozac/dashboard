import { authLogout, addLoader, removeLoader } from 'stores';
import * as utils from 'utils';

export const getLossActions = (lossData) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}} = getState();

  const defaultError = {
    file: 'stores/claims.actions.getLossActions',
  };

  const endpointParams = {
    claimId: lossData?.claimID || '',
  };

  const lossDetailId = lossData?.lossDetailId || lossData?.lossDetailID;

  dispatch(getLossActionsRequest());
  dispatch(addLoader('getLossActions'));

  return utils.api
    .get({
      token: auth.accessToken,
      endpoint: endpoint.claimService,
      path: `api/data/loss/${lossDetailId}/action`,
      params: endpointParams,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((data) => {
      dispatch(getLossActionsSuccess(data));
      dispatch(removeLoader('getLossActions'));
      return data;
    })
    .catch((err) => {
      dispatch(getLossActionsFailure(err, defaultError));
      dispatch(removeLoader('getLossActions'));
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      return err;
    });
};

export const getLossActionsRequest = (data) => {
  return {
    type: 'CLAIMS_LOSS_ACTIONS_GET_REQUEST',
    payload: data,
  };
};

export const getLossActionsSuccess = (data) => {
  return {
    type: 'CLAIMS_LOSS_ACTIONS_GET_SUCCESS',
    payload: data,
  };
};

export const getLossActionsFailure = (data) => {
  return {
    type: 'CLAIMS_LOSS_ACTIONS_GET_FAILURE',
    payload: data,
  };
};
