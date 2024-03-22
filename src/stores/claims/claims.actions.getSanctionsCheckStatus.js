import * as utils from 'utils';
import { authLogout, addLoader, removeLoader } from 'stores';

export const getSanctionsCheckStatus =
  (rootProcessId, viewLoader = false) =>
  (dispatch, getState) => {
    // prettier-ignore
    const { user: { auth }, config: { vars: { endpoint } } } = getState();

    const defaultError = {
      file: 'stores/claims.actions.getSanctionsCheckStatus',
    };

    dispatch(getSanctionsCheckStatusRequest());
    viewLoader && dispatch(addLoader('getSanctionsCheckStatus'));

    if (!rootProcessId) {
      dispatch(getSanctionsCheckStatusFailure({ ...defaultError, message: 'Missing requests params' }));
      dispatch(removeLoader('getSanctionsCheckStatus'));
      return;
    }

    return utils.api
      .get({
        token: auth.accessToken,
        endpoint: endpoint.bpmService,
        path: `workflow/process/task/${rootProcessId}/sanctionResult`,
      })
      .then((response) => utils.api.handleResponse(response))
      .then((json) => utils.api.handleNewData(json))
      .then((data) => {
        dispatch(getSanctionsCheckStatusSuccess(data.data));
        return data.data;
      })
      .catch((err) => {
        const errorParams = {
          ...defaultError,
          message: 'API post error',
        };

        utils.api.handleError(err, errorParams);
        utils.api.handleUnauthorized(err, dispatch, authLogout);
        dispatch(getSanctionsCheckStatusFailure(err));
        return err;
      })
      .finally(() => {
        viewLoader && dispatch(removeLoader('getSanctionsCheckStatus'));
      });
  };

export const getSanctionsCheckStatusRequest = (params) => {
  return {
    type: 'GET_SANCTIONS_CHECK_STATUS_REQUEST',
    payload: params,
  };
};

export const getSanctionsCheckStatusSuccess = (data) => {
  return {
    type: 'GET_SANCTIONS_CHECK_STATUS_SUCCESS',
    payload: data,
  };
};

export const getSanctionsCheckStatusFailure = (error) => {
  return {
    type: 'GET_SANCTIONS_CHECK_STATUS_FAILURE',
    payload: error,
  };
};
