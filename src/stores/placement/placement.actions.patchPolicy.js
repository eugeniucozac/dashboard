import { addLoader, authLogout, enqueueNotification, hideModal, removeLoader } from 'stores';
import * as utils from 'utils';

export const patchPolicy = (policyId, body) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}} = getState();

  const defaultError = {
    file: 'stores/placement.actions.patchPolicy',
    message: 'Data missing for PATCH request',
  };

  dispatch(patchPolicyRequest(policyId, body));
  dispatch(addLoader('placementPatchPolicy'));

  if (!policyId || !utils.generic.isValidObject(body)) {
    dispatch(patchPolicyFailure(defaultError));
    dispatch(enqueueNotification('notification.patchPolicy.fail', 'error'));
    dispatch(hideModal());
    dispatch(removeLoader('placementPatchPolicy'));
    return;
  }

  return utils.api
    .patch({
      token: auth.accessToken,
      endpoint: endpoint.edge,
      path: `api/policy/${policyId}`,
      data: body,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleData(json))
    .then((data) => {
      dispatch(patchPolicySuccess(data));
      dispatch(enqueueNotification('notification.patchPolicy.success', 'success'));
      dispatch(hideModal());
      dispatch(removeLoader('placementPatchPolicy'));
    })
    .catch((err) => {
      const errorParams = {
        ...defaultError,
        message: 'API delete error (placement.patchPolicy)',
      };

      utils.api.handleError(err, errorParams);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(patchPolicyFailure(err));
      dispatch(enqueueNotification('notification.patchPolicy.fail', 'error'));
      dispatch(hideModal());
      dispatch(removeLoader('placementPatchPolicy'));
      return Promise.reject(err);
    });
};

export const patchPolicyRequest = (policyId, body) => {
  return {
    type: 'PLACEMENT_EDIT_POLICY_PATCH_REQUEST',
    payload: { policyId, body },
  };
};

export const patchPolicySuccess = (data) => {
  return {
    type: 'PLACEMENT_POLICY_PATCH_SUCCESS',
    payload: data,
  };
};

export const patchPolicyFailure = (error) => {
  return {
    type: 'PLACEMENT_EDIT_POLICY_PATCH_FAILURE',
    payload: error,
  };
};
