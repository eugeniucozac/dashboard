import { addLoader, authLogout, removeLoader } from 'stores';
import * as utils from 'utils';
import { ORGANIZATIONS } from 'consts';

export const getTaskChecklist =
  (params = {}) =>
  (dispatch, getState) => {
    // prettier-ignore
    const { user: { auth }, config: { vars: { endpoint } } } = getState();

    const { taskCode, taskId, userOrgName } = params;

    const orgId = ORGANIZATIONS[userOrgName]?.id;
    const viewLoader = params?.viewLoader ?? true

    const defaultError = {
      file: 'stores/claims.actions.getTaskChecklist',
    };

    dispatch(getTaskChecklistRequest(params));
    viewLoader &&  dispatch(addLoader('getTaskChecklist'));

    return utils.api
      .get({
        token: auth.accessToken,
        endpoint: endpoint.bpmService,
        path: `workflow/task/${taskCode}/checkList?organisationId=${orgId}&taskId=${taskId}`,
      })
      .then((response) => utils.api.handleResponse(response))
      .then((data) => utils.api.handleNewData(data))
      .then((json) => {
        dispatch(getTaskChecklistSuccess(json));
        return json;
      })
      .catch((err) => {
        dispatch(getTaskChecklistFailure(err, defaultError));
        utils.api.handleUnauthorized(err, dispatch, authLogout);
        return err;
      })
      .finally(() => {
        viewLoader &&  dispatch(removeLoader('getTaskChecklist'));
      });
  };

export const getTaskChecklistRequest = (params) => {
  return {
    type: 'CLAIMS_TASK_PROCESSING_GET_CHECKLIST_REQUEST',
    payload: params,
  };
};

export const getTaskChecklistSuccess = (json) => {
  return {
    type: 'CLAIMS_TASK_PROCESSING_GET_CHECKLIST_SUCCESS',
    payload: json.data,
  };
};

export const getTaskChecklistFailure = (error) => {
  return {
    type: 'CLAIMS_TASK_PROCESSING_GET_CHECKLIST_FAILURE',
    payload: error,
  };
};
