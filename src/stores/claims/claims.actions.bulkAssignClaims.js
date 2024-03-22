import { authLogout, addLoader, removeLoader, enqueueNotification, hideModal } from 'stores';
import * as constants from 'consts';
import * as utils from 'utils';

export const bulkAssignClaims = (claims, teams, formData) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth, organisation }, config: { vars: { endpoint }}} = getState();

  const { assignTo, notes, team, complexity } = formData;

  const defaultError = {
    file: 'stores/claims.actions.bulkAssignClaims',
  };

  dispatch(bulkAssignClaimsRequest(claims, teams, formData));
  dispatch(addLoader('bulkAssignClaims'));

  if (utils.generic.isInvalidOrEmptyArray(claims) || utils.generic.isInvalidOrEmptyArray(teams) || !team) {
    dispatch(bulkAssignClaimsFailure({ ...defaultError, message: 'Missing request params' }));
  }

  const isAssigneeOnSameTeam = formData?.assignTo?.organisationId?.toString() === organisation?.id?.toString();

  const postPayload = {
    note: notes,
    assignTo: assignTo?.email || null,
    organizationId: isAssigneeOnSameTeam ? null : constants.ORGANIZATIONS[team].id,
    organizationName: isAssigneeOnSameTeam ? null : constants.ORGANIZATIONS[team].label,
    complexityRuleId: complexity?.complexityRulesID || null,
    processDetail: claims.map((claim) => ({
      claimID: claim.claimID,
      caseIncidentID: claim.caseIncidentID,
      processId: claim.processID,
    })),
  };

  return utils.api
    .post({
      token: auth.accessToken,
      endpoint: endpoint.bpmService,
      path: 'workflow/process/claim/updateAssignee',
      data: postPayload,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleNewData(json))
    .then((data) => {
      dispatch(bulkAssignClaimsSuccess(data.data));
      dispatch(enqueueNotification(utils.string.t('claims.processing.bulkAssign.notifications.claims.success'), 'success'));
      return data;
    })
    .catch((error) => {
      dispatch(bulkAssignClaimsFailure(error, defaultError));
      dispatch(enqueueNotification(utils.string.t('claims.processing.bulkAssign.notifications.claims.failure'), 'error'));
      utils.api.handleUnauthorized(error, dispatch, authLogout);
      return error;
    })
    .finally(() => {
      dispatch(hideModal());
      dispatch(removeLoader('bulkAssignClaims'));
    });
};

export const bulkAssignClaimsRequest = (claims, teams, formData) => {
  return {
    type: 'CLAIMS_PROCESSING_BULK_ASSIGN_REQUEST',
    payload: { claims, teams, formData },
  };
};

export const bulkAssignClaimsSuccess = (data) => {
  return {
    type: 'CLAIMS_PROCESSING_BULK_ASSIGN_SUCCESS',
    payload: data,
  };
};

export const bulkAssignClaimsFailure = (error) => {
  return {
    type: 'CLAIMS_PROCESSING_BULK_ASSIGN_ERROR',
    payload: error,
  };
};
