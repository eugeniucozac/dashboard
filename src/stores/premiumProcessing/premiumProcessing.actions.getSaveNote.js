import * as utils from 'utils';
import { authLogout, addLoader, enqueueNotification, removeLoader } from 'stores';

export const premiumProcessingNoteSave = (params) => (dispatch, getState) => {
  const {
    user: { auth },
    config: {
      vars: { endpoint },
    },
  } = getState();

  dispatch(addLoader('premiumProcessingNoteSave'));

  const saveNotesRequest = {
    bpmTaskId: params.taskId,
    notes: params.comments,
  };

  return utils.api
    .post({
      token: auth.accessToken,
      endpoint: endpoint.bpmService,
      path: 'notes/addNotes',
      data: saveNotesRequest,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleNewData(json))
    .then((data) => {
      dispatch(premiumProcessingNoteSaveSuccess(data?.data));
      dispatch(enqueueNotification(data.message, 'success'));
      return data;
    })
    .catch((error) => {
      dispatch(
        premiumProcessingNoteSaveError(error, {
          file: 'stores/premiumProcessing.actions.getSaveNote',
        })
      );
      dispatch(enqueueNotification('premiumProcessing.saveNotes.fail', 'error'));
      utils.api.handleUnauthorized(error, dispatch, authLogout);
      return error;
    })
    .finally(() => {
      dispatch(removeLoader('premiumProcessingNoteSave'));
    });
};

export const premiumProcessingNoteSaveSuccess = (data) => {
  return {
    type: 'PREMIUM_PROCESSING_SAVE_NOTE_GET_SUCCESS',
    payload: data,
  };
};

export const premiumProcessingNoteSaveError = (error) => {
  return {
    type: 'PREMIUM_PROCESSING_SAVE_NOTE_GET_ERROR',
    payload: error,
  };
};
