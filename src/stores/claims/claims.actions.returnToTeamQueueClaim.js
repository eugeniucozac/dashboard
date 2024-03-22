import { addLoader, removeLoader, enqueueNotification, hideModal, authLogout } from 'stores';
import * as utils from 'utils';

export const returnToTeamQueueClaim = (claim) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}} = getState();

  const defaultError = {
    file: 'stores/claims.actions.returnToTeamQueueClaim',
  };

  dispatch(returnToTeamQueueClaimRequest(claim));
  dispatch(addLoader('returnToTeamQueueClaim'));

  if (!claim?.processID) {
    dispatch(returnToTeamQueueClaimFailure({ ...defaultError, message: 'Missing processID param' }));
    dispatch(removeLoader('returnToTeamQueueClaim'));
    return;
  }

  return utils.api
    .post({
      token: auth.accessToken,
      endpoint: endpoint.bpmService,
      path: `workflow/process/claim/${claim?.processID}/returnToTeam`,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleNewData(json))
    .then((data) => {
      dispatch(returnToTeamQueueClaimSuccess(data.data));
      dispatch(enqueueNotification(utils.string.t('claims.claimRef.popOverItems.claimToTeamQueueSuccessMessage'), 'success'));
      return data;
    })
    .catch((error) => {
      dispatch(returnToTeamQueueClaimFailure(error, defaultError));
      dispatch(enqueueNotification(utils.string.t('claims.claimRef.popOverItems.claimToTeamQueueErrorMessage'), 'error'));
      utils.api.handleUnauthorized(error, dispatch, authLogout);
      return error;
    })
    .finally(() => {
      dispatch(hideModal());
      dispatch(removeLoader('returnToTeamQueueClaim'));
    });
};

export const returnToTeamQueueClaimRequest = (claim) => {
  return {
    type: 'CLAIM_RETURN_TO_TEAM_QUEUE_REQUEST',
    payload: { claim },
  };
};

export const returnToTeamQueueClaimSuccess = (data) => {
  return {
    type: 'CLAIM_RETURN_TO_TEAM_QUEUE_SUCCESS',
    payload: data,
  };
};

export const returnToTeamQueueClaimFailure = (error) => {
  return {
    type: 'CLAIM_RETURN_TO_TEAM_QUEUE_ERROR',
    payload: error,
  };
};
