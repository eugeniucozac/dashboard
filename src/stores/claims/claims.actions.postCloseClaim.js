import { enqueueNotification, addLoader, removeLoader, authLogout } from 'stores';
import * as utils from 'utils';

export const postCloseClaim = (taskId, data) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}} = getState();

  const defaultError = {
    file: 'stores/claims.actions.postCloseClaim',
  };

  dispatch(postCloseClaimRequest());
  dispatch(addLoader('postCloseClaim'));

  return utils.api
    .post({
      token: auth.accessToken,
      endpoint: endpoint.bpmService,
      path: `workflow/task/${taskId}/next`,
      data: data,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleNewData(json))
    .then((data) => {
      dispatch(postCloseClaimSuccess(data));
      dispatch(
        enqueueNotification(data.message, 'success', {
          keepAfterUrlChange: true,
        })
      );
      return data;
    })
    .catch((err) => {
      dispatch(postCloseClaimsFailure(err, defaultError));
      dispatch(
        enqueueNotification(err.message, 'error', {
          keepAfterUrlChange: true,
        })
      );
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      return err;
    })
    .finally(() => {
      dispatch(removeLoader('postCloseClaim'));
    });
};

export const postCloseClaimRequest = (params) => {
  return {
    type: 'CLOSE_CLAIMS_POST_REQUEST',
    payload: params,
  };
};

export const postCloseClaimSuccess = (data) => {
  return {
    type: 'CLOSE_CLAIMS_POST_SUCCESS',
    payload: data,
  };
};

export const postCloseClaimsFailure = (error) => {
  return {
    type: 'CLOSE_CLAIMS_POST_ERROR',
    payload: error,
  };
};
