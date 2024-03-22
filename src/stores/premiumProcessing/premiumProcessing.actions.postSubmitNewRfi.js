import { authLogout, addLoader, removeLoader, enqueueNotification } from 'stores';
import * as utils from 'utils';
import { RESOLVE, INTERNALRFI, SEND_TO_FEC } from 'consts';

export const postSubmitNewRfi = (payload) => (dispatch, getState) => {
  const {
    user: { auth },
    config: {
      vars: { endpoint },
    },
  } = getState();

  dispatch(postSubmitNewRfiRequest(payload));
  dispatch(addLoader('postSubmitNewRfi'));

  return utils.api
    .post({
      token: auth.accessToken,
      endpoint: endpoint.bpmService,
      path: 'api/workflow/process/sendClaimRFI',
      data: payload,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleNewData(json))
    .then((data) => {
      dispatch(postSubmitNewRfiSuccess(data));
      if (payload.taskCategory === INTERNALRFI) {
        dispatch(
          enqueueNotification('notification.newRfi.success', 'success', {
            keepAfterUrlChange: true,
            data: { id: data?.data?.taskDefinitionKey },
          })
        );
      } else {
        if (payload.action === RESOLVE || payload.action === SEND_TO_FEC) {
          dispatch(
            enqueueNotification(
              (payload.action === RESOLVE && 'notification.newExternalRfi.resolveSuccess') ||
                (payload.action === SEND_TO_FEC && 'notification.newExternalRfi.sendFECSuccess'),
              'success',
              {
                keepAfterUrlChange: true,
                data: { id: data?.data?.taskDefinitionKey },
              }
            )
          );
        } else {
          dispatch(
            enqueueNotification('notification.newExternalRfi.success', 'success', {
              keepAfterUrlChange: true,
              data: { id: data?.data?.taskDefinitionKey },
            })
          );
        }
      }
      return data;
    })
    .catch((err) => {
      dispatch(postSubmitNewRfiFailure(err));
      if (payload.taskCategory === INTERNALRFI) {
        dispatch(enqueueNotification('notification.newRfi.fail', 'error'));
      } else {
        if (payload.action === RESOLVE || payload.action === SEND_TO_FEC) {
          dispatch(
            enqueueNotification(
              (payload.action === RESOLVE && 'notification.newExternalRfi.resolveFail') ||
                (payload.action === SEND_TO_FEC && 'notification.newExternalRfi.sendFECFail'),
              'error',
              {
                keepAfterUrlChange: true,
              }
            )
          );
        } else {
          dispatch(
            enqueueNotification('notification.newExternalRfi.fail', 'error', {
              keepAfterUrlChange: true,
            })
          );
        }
      }
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      return err;
    })
    .finally(() => {
      dispatch(removeLoader('postSubmitNewRfi'));
    });
};

export const postSubmitNewRfiRequest = (payload) => {
  return {
    type: 'PREMIUM_PROCESSING_SUBMIT_NEW_RFI_POST_REQUEST',
    payload: payload,
  };
};

export const postSubmitNewRfiSuccess = (data) => {
  return {
    type: 'PREMIUM_PROCESSING_SUBMIT_NEW_RFI_POST_SUCCESS',
    payload: {
      items: data.data,
    },
  };
};

export const postSubmitNewRfiFailure = (error) => {
  return {
    type: 'PREMIUM_PROCESSING_SUBMIT_NEW_RFI_POST_FAILURE',
    payload: error,
  };
};
