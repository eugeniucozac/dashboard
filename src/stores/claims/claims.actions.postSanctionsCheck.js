// app
import * as utils from 'utils';
import { authLogout, addLoader, enqueueNotification, hideModal, removeLoader } from 'stores';

export const postSanctionsCheck = (formData) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint } } } = getState();

  const defaultError = {
    file: 'stores/claims.actions.postSanctionsCheck',
  };

  dispatch(postSanctionsCheckRequest(formData));
  dispatch(addLoader('postSanctionsCheck'));

  if (!formData || !formData.taskId) {
    dispatch(postSanctionsCheckFailure(defaultError));
    dispatch(enqueueNotification('notification.createSanctionCheck.fail', 'error'));
    dispatch(removeLoader('postSanctionsCheck'));
    return;
  }
  const { rootProcessId, taskId } = formData;

  const data = {
    rootProcessId: rootProcessId,
  };

  return utils.api
    .post({
      token: auth.accessToken,
      endpoint: endpoint.bpmService,
      path: `workflow/task/${taskId}/sanctionsCheck`,
      data,
    })
    .then((response) => {
      return utils.api.handleResponse(response);
    })
    .then((json) => utils.api.handleNewData(json))
    .then((data) => {
      dispatch(postSanctionsCheckSuccess(data));
      dispatch(enqueueNotification('notification.createSanctionCheck.success', 'success'));
      return data;
    })
    .catch((err) => {
      const errorParams = {
        ...defaultError,
        message: 'API fetch error (claims.postSanctionsCheck)',
      };

      utils.api.handleError(err, errorParams);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(postSanctionsCheckFailure(err));
      dispatch(enqueueNotification('notification.createSanctionCheck.fail', 'error'));
      return err;
    })
    .finally(() => {
      dispatch(removeLoader('postSanctionsCheck'));
      dispatch(hideModal());
    });
};

export const postSanctionsCheckRequest = (params) => {
  return {
    type: 'CLAIMS_TASK_CREATE_SANCTIONS_CHECK',
    payload: params,
  };
};

export const postSanctionsCheckSuccess = (data) => {
  return {
    type: 'CLAIMS_TASK_SANCTIONS_CHECK_POST_SUCCESS',
    payload: data,
  };
};

export const postSanctionsCheckFailure = (error) => {
  return {
    type: 'CLAIMS_TASK_SANCTIONS_CHECK_POST_FAILURE',
    payload: error,
  };
};
