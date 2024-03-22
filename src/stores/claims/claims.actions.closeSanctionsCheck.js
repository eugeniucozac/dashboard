import * as utils from 'utils';
import { authLogout, addLoader, enqueueNotification, removeLoader } from 'stores';

export const closeSanctionsCheck =
  ({ sanctionsResult, taskId, resolutionComments, caseIncidentID, processId }, successCallback) =>
  (dispatch, getState) => {
    const {
      user: { auth },
      config: {
        vars: { endpoint },
      },
    } = getState();
    const defaultError = {
      file: 'stores/claims.actions.closeSanctionsCheck',
    };

    dispatch(closeSanctionsCheckRequest({ sanctionsResult, taskId }));
    dispatch(addLoader('closeSanctionsCheck'));
    return utils.api
      .post({
        token: auth.accessToken,
        endpoint: endpoint.bpmService,
        path: `workflow/task/${taskId}/next`,
        data: { sanctionsResult, resolutionComments, taskId, caseIncidentID, processId },
      })
      .then((response) => utils.api.handleResponse(response))
      .then((json) => utils.api.handleNewData(json, true))
      .then((data) => {
        dispatch(closeSanctionsCheckSuccess(data));
        successCallback();
        dispatch(enqueueNotification('notification.closeSanctionsCheck.success', 'success'));
      })
      .catch((err) => {
        const errorParams = {
          ...defaultError,
          message: 'API post error',
        };

        utils.api.handleError(err, errorParams);
        utils.api.handleUnauthorized(err, dispatch, authLogout);
        dispatch(closeSanctionsCheckFailure(err));
        dispatch(enqueueNotification('notification.closeSanctionsCheck.fail', 'error'));
      })
      .finally(() => {
        dispatch(removeLoader('closeSanctionsCheck'));
      });
  };

export const closeSanctionsCheckRequest = (params) => {
  return {
    type: 'CLOSE_SANCTIONS_CHECK_SUCCESS',
    payload: params,
  };
};

export const closeSanctionsCheckSuccess = (data) => {
  return {
    type: 'CLOSE_SANCTIONS_CHECK_SUCCESS',
    payload: data,
  };
};

export const closeSanctionsCheckFailure = (err) => {
  return {
    type: 'CLOSE_SANCTIONS_CHECK_SUCCESS',
    payload: err,
  };
};
