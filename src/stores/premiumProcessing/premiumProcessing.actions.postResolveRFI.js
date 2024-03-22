import * as utils from 'utils';
import { authLogout, addLoader, enqueueNotification, removeLoader } from 'stores';

export const premiumProcessingResolveRFI = (rfiData) => (dispatch, getState) => {
  const {
    user: { auth },
    config: {
      vars: { endpoint },
    },
  } = getState();

  const data = {
    documentId: rfiData?.documentId,
    resolutionCode: rfiData?.resolutionCode,
    resolutionComments: rfiData?.resolutionComments,
  };

  dispatch(premiumProcessingResolveRFIRequest(data));
  dispatch(addLoader('premiumProcessingResolveRFI'));

  return utils.api
    .post({
      token: auth.accessToken,
      endpoint: endpoint.bpmService,
      path: `workflow/task/${rfiData?.taskId}/next`,
      data: data,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleNewData(json, true))
    .then((data) => {
      dispatch(premiumProcessingResolveRFISuccess(rfiData?.queryId));
      dispatch(
        enqueueNotification('notification.resolveRFI.success', 'success', { keepAfterUrlChange: true, data: { id: rfiData?.queryId } })
      );
      return data;
    })
    .catch((error) => {
      dispatch(
        premiumProcessingResolveRFIError(error, {
          file: 'stores/premiumProcessing.actions.postResolveRFI',
        })
      );
      dispatch(enqueueNotification('notification.resolveRFI.fail', 'error'));
      utils.api.handleUnauthorized(error, dispatch, authLogout);
      return error;
    })
    .finally(() => {
      dispatch(removeLoader('premiumProcessingResolveRFI'));
    });
};

export const premiumProcessingResolveRFIRequest = (params) => {
  return {
    type: 'PREMIUM_PROCESSING_RESOLVE_RFI_REQUEST',
    payload: params,
  };
};

export const premiumProcessingResolveRFISuccess = (data) => {
  return {
    type: 'PREMIUM_PROCESSING_RESOLVE_RFI_GET_SUCCESS',
    payload: data,
  };
};

export const premiumProcessingResolveRFIError = (error) => {
  return {
    type: 'PREMIUM_PROCESSING_RESOLVE_RFI_GET_ERROR',
    payload: error,
  };
};
