import { addLoader, removeLoader, enqueueNotification, hideModal, authLogout } from 'stores';
import * as constants from 'consts';
import * as utils from 'utils';

export const singleAssignClaim = (claims, formData) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth, organisation }, config: { vars: { endpoint } } } = getState();

  const { assignTo, notes, team, complexity, complexityBasis } = formData;

  const defaultError = {
    file: 'stores/claims.actions.singleAssignClaim',
  };

  dispatch(singleAssignClaimRequest(claims, formData));
  dispatch(addLoader('singleAssignClaim'));

  if (utils.generic.isInvalidOrEmptyArray(claims) || !team) {
    dispatch(singleAssignClaimFailure({ ...defaultError, message: 'Missing request params' }));
  }

  const isAssigneeOnSameTeam = formData?.assignTo?.organisationId?.toString() === organisation?.id?.toString();

  const isComplexityChanged = complexity?.complextityType?.toLowerCase() !== claims?.[0]?.complexity?.toLowerCase();
  const postPayload = {
    note: notes,
    assignTo: assignTo?.email || null,
    organizationId: isAssigneeOnSameTeam ? null : constants?.ORGANIZATIONS[team.toLowerCase()]?.id,
    organizationName: isAssigneeOnSameTeam ? null : constants?.ORGANIZATIONS[team.toLowerCase()]?.label,
    complexityRuleId: complexityBasis?.complexityRulesID || null,
    complexityType: isComplexityChanged ? complexity?.complextityType || null : null,
    processDetail: claims.map((claim) => ({
      claimID: claim?.claimID,
      caseIncidentID: claim?.caseIncidentID,
      processId: claim?.processID,
    })),
  };

  return utils.api
    .post({
      token: auth.accessToken,
      endpoint: endpoint.claimService,
      path: 'api/workflow/claim/updateAssignee',
      data: postPayload,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleNewData(json))
    .then((data) => {
      dispatch(singleAssignClaimSuccess(data.data));
      dispatch(enqueueNotification(utils.string.t('claims.processing.bulkAssign.notifications.claims.success'), 'success'));
      return data;
    })
    .catch((error) => {
      dispatch(singleAssignClaimFailure(error, defaultError));
      dispatch(enqueueNotification(utils.string.t('claims.processing.bulkAssign.notifications.claims.failure'), 'error'));
      utils.api.handleUnauthorized(error, dispatch, authLogout);
      return error;
    })
    .finally(() => {
      dispatch(hideModal());
      dispatch(removeLoader('singleAssignClaim'));
    });
};

export const singleAssignClaimRequest = (claims, formData) => {
  return {
    type: 'CLAIMS_PROCESSING_SINGLE_ASSIGN_REQUEST',
    payload: { claims, formData },
  };
};

export const singleAssignClaimSuccess = (data) => {
  return {
    type: 'CLAIMS_PROCESSING_SINGLE_ASSIGN_SUCCESS',
    payload: data,
  };
};

export const singleAssignClaimFailure = (error) => {
  return {
    type: 'CLAIMS_PROCESSING_SINGLE_ASSIGN_ERROR',
    payload: error,
  };
};
