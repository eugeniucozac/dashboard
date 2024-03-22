import * as utils from 'utils';
import { authLogout, addLoader, enqueueNotification, removeLoader } from 'stores';

export const premiumProcessingRespondRFI = (rfiData) => (dispatch, getState) => {
  const {
    user: { auth },
    config: {
      vars: { endpoint },
    },
  } = getState();
  dispatch(premiumProcessingRespondRFIRequest(rfiData));
  dispatch(addLoader('premiumProcessingRespondRFI'));

  return utils.api
    .post({
      token: auth.accessToken,
      endpoint: endpoint.bpmService,
      path: 'api/workflow/process/rfi-reply',
      data: rfiData,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleNewData(json))
    .then((data) => {
      dispatch(premiumProcessingRespondRFISuccess(data));
      dispatch(
        enqueueNotification('notification.respondRFI.success', 'success', { keepAfterUrlChange: true, data: { id: data?.data?.taskRef } })
      );
      return data;
    })
    .catch((error) => {
      dispatch(
        premiumProcessingRespondRFIError(error, {
          file: 'stores/premiumProcessing.actions.postRespondRFI',
        })
      );
      dispatch(enqueueNotification('notification.respondRFI.fail', 'error'));
      utils.api.handleUnauthorized(error, dispatch, authLogout);
      return error;
    })
    .finally(() => {
      dispatch(removeLoader('premiumProcessingRespondRFI'));
    });
};

export const premiumProcessingRespondRFIRequest = (payload) => {
  return {
    type: 'PREMIUM_PROCESSING_RESPOND_RFI_REQUEST',
    payload,
  };
};

export const premiumProcessingRespondRFISuccess = (data) => {
  return {
    type: 'PREMIUM_PROCESSING_RESPOND_RFI_GET_SUCCESS',
    payload: data.data,
  };
};

export const premiumProcessingRespondRFIError = (error) => {
  return {
    type: 'PREMIUM_PROCESSING_RESPOND_RFI_GET_ERROR',
    payload: error,
  };
};
