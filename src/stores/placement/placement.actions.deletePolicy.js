import { addLoader, authLogout, deletePlacementPolicies, enqueueNotification, hideModal, removeLoader } from 'stores';
import * as utils from 'utils';

export const deletePlacementPolicy = (policyId) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}} = getState();

  const defaultError = {
    file: 'stores/placement.actions.deletePolicy',
    message: 'Data missing for DELETE request',
  };

  dispatch(postPlacementDeletePolicyRequest(policyId));
  dispatch(addLoader('deletePlacementPolicy'));

  if (!policyId) {
    dispatch(postPlacementDeletePolicyFailure(defaultError));
    dispatch(enqueueNotification('notification.deletePolicy.fail', 'error'));
    dispatch(hideModal());
    dispatch(removeLoader('deletePlacementPolicy'));
    return;
  }

  return utils.api
    .delete({
      token: auth.accessToken,
      endpoint: endpoint.edge,
      path: `api/policy/${policyId}`,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleData(json))
    .then((data) => {
      dispatch(postPlacementDeletePolicySuccess(data));
      dispatch(deletePlacementPolicies([policyId]));
      dispatch(enqueueNotification('notification.deletePolicy.success', 'success'));
      dispatch(hideModal());
      dispatch(removeLoader('deletePlacementPolicy'));
    })
    .catch((err) => {
      const errorParams = {
        ...defaultError,
        message: 'API delete error (placement.deletePolicy)',
      };

      utils.api.handleError(err, errorParams);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(postPlacementDeletePolicyFailure(err));
      dispatch(enqueueNotification('notification.deletePolicy.fail', 'error'));
      dispatch(hideModal());
      dispatch(removeLoader('deletePlacementPolicy'));
      return err;
    });
};

export const postPlacementDeletePolicyRequest = (data) => {
  return {
    type: 'PLACEMENT_POLICY_DELETE_REQUEST',
    payload: data,
  };
};

export const postPlacementDeletePolicySuccess = (data) => {
  return {
    type: 'PLACEMENT_POLICY_DELETE_SUCCESS',
    payload: data,
  };
};

export const postPlacementDeletePolicyFailure = (error) => {
  return {
    type: 'PLACEMENT_POLICY_DELETE_FAILURE',
    payload: error,
  };
};
