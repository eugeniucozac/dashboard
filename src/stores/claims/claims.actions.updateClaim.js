import { addLoader, removeLoader, enqueueNotification, hideModal, authLogout } from 'stores';
import * as utils from 'utils';
import * as constants from 'consts';

export const updateClaim = (claims, formData) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint } } } = getState();

  const { assignTo, complexity, complexityBasis, notes, priority, priorityId, team, teamId } = formData;

  const defaultError = {
    file: 'stores/claims.actions.updateClaim',
  };

  dispatch(updateClaimRequest({ claims, formData }));
  dispatch(addLoader('updateClaim'));

  if (!team || !teamId || !complexity || !priority || !priorityId || utils.generic.isInvalidOrEmptyArray(claims)) {
    dispatch(updateClaimFailure({ ...defaultError, message: 'Missing request params' }));
  }

  const payload = {
    assignTo: assignTo?.email || '',
    complexityRuleId: complexity === constants.CLAIM_COMPLEXITY_COMPLEX ? complexityBasis?.complexityRulesID || '' : null,
    complexityType: complexity,
    note: notes || '',
    organizationId: teamId,
    organizationName: team,
    priority: priority,
    priorityId: priorityId,
    processDetail: claims.map((claim) => ({
      claimID: claim.claimID || claim.claimId,
      caseIncidentID: claim.caseIncidentID || claim.caseIncidentId,
      processId: claim.processID || claim.processId,
    })),
  };

  return utils.api
    .post({
      token: auth.accessToken,
      endpoint: endpoint.claimService,
      path: 'api/workflow/claim/updateAssignee',
      data: payload,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleNewData(json))
    .then((data) => {
      dispatch(updateClaimSuccess(claims, formData));
      dispatch(enqueueNotification(utils.string.t('claims.processing.notification.updateClaimSuccess'), 'success'));
      return data;
    })
    .catch((error) => {
      dispatch(updateClaimFailure(error));
      dispatch(enqueueNotification(utils.string.t('claims.processing.notification.updateClaimFailure'), 'error'));
      utils.api.handleUnauthorized(error, dispatch, authLogout);
      return error;
    })
    .finally(() => {
      dispatch(hideModal());
      dispatch(removeLoader('updateClaim'));
    });
};

export const updateClaimRequest = (params) => {
  return {
    type: 'CLAIMS_PROCESSING_UPDATE_CLAIM_REQUEST',
    payload: params,
  };
};

export const updateClaimSuccess = (claims, values) => {
  return {
    type: 'CLAIMS_PROCESSING_UPDATE_CLAIM_SUCCESS',
    payload: { claims, values },
  };
};

export const updateClaimFailure = (error) => {
  return {
    type: 'CLAIMS_PROCESSING_UPDATE_CLAIM_FAILURE',
    payload: error,
  };
};
