// app
import * as utils from 'utils';
import { authLogout, addLoader, enqueueNotification, hideModal, removeLoader } from 'stores';

export const editClaimPriority = (formData, priorities, claim) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint } } } = getState();

  const defaultError = {
    file: 'stores/claims.actions.editClaimPriority',
  };

  const { priority } = formData;
  const { claimID, processID } = claim;

  dispatch(editClaimPriorityRequest(formData, priorities, claim));
  dispatch(addLoader('editClaimPriority'));

  if (!formData || !priority || !claimID) {
    dispatch(editClaimPriorityFailure({ ...defaultError, message: 'Missing request params' }));
    dispatch(hideModal());
    dispatch(removeLoader('editClaimPriority'));
    return;
  }

  return utils.api
    .put({
      token: auth.accessToken,
      endpoint: endpoint.claimService,
      path: `api/workflow/claims/${claimID}/process/${processID}/priority/${priority}`,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleNewData(json))
    .then((data) => {
      const priorityId = data?.data;
      const priorityName = priorities.find((p) => p.id?.toString() === priorityId?.toString())?.description;

      dispatch(editClaimPrioritySuccess(priorityId, priorityName, claimID));
      dispatch(enqueueNotification('notification.claimPriority.success', 'success'));
      return priorityId;
    })
    .catch((err) => {
      const errorParams = {
        ...defaultError,
        message: 'API fetch error (claims.actions.editClaimPriority)',
      };

      utils.api.handleError(err, errorParams);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(editClaimPriorityFailure(err));
      dispatch(enqueueNotification('notification.claimPriority.fail', 'error'));
      return err;
    })
    .finally(() => {
      dispatch(hideModal());
      dispatch(removeLoader('editClaimPriority'));
    });
};

export const editClaimPriorityRequest = (formData, priorities, claim) => {
  return {
    type: 'CLAIMS_SET_PRIORITY_REQUEST',
    payload: { formData, priorities, claim },
  };
};

export const editClaimPrioritySuccess = (priorityId, priorityName, claimID) => {
  return {
    type: 'CLAIMS_SET_PRIORITY_SUCCESS',
    payload: { priorityId, priorityName, claimID },
  };
};

export const editClaimPriorityFailure = (error) => {
  return {
    type: 'CLAIMS_SET_PRIORITY_FAILURE',
    payload: error,
  };
};
