import { authLogout, addLoader, removeLoader, enqueueNotification, hideModal } from 'stores';
import * as utils from 'utils';

export const addTaskNote = (formData, taskObj) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}} = getState();

  const defaultError = {
    file: 'stores/claims.actions.addTaskNote',
  };

  dispatch(addTaskNoteRequest(formData, taskObj));
  dispatch(addLoader('addTaskNote'));

  if (!formData?.details || !taskObj?.taskId || !taskObj?.caseIncidentID) {
    dispatch(addTaskNoteFailure({ ...defaultError, message: 'Missing requests params' }));
    dispatch(removeLoader('addTaskNote'));
    return;
  }

  const data = {
    bpmTaskID: taskObj.taskId,
    caseIncidentID: taskObj.caseIncidentID,
    notesDescription: formData.details,
    caseIncidentNotesID: 0,
    isActive: 1,
  };

  return utils.api
    .post({
      token: auth.accessToken,
      endpoint: endpoint.bpmService,
      path: 'notes/save',
      data: data,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleNewData(json))
    .then((data) => {
      dispatch(addTaskNoteSuccess(data.data));
      dispatch(enqueueNotification(utils.string.t('claims.notes.notifications.addNoteSuccess'), 'success', {
        keepAfterUrlChange: true
      }));
      return data;
    })
    .catch((error) => {
      dispatch(addTaskNoteFailure(error, defaultError));
      dispatch(enqueueNotification(utils.string.t('claims.notes.notifications.addNoteFailure'), 'error'));
      utils.api.handleUnauthorized(error, dispatch, authLogout);
      return error;
    })
    .finally(() => {
      dispatch(removeLoader('addTaskNote'));
      dispatch(hideModal());
    });
};

export const addTaskNoteRequest = (formData, taskObj) => {
  return {
    type: 'CLAIMS_TASK_ADD_NOTE_REQUEST',
    payload: { formData, taskObj },
  };
};

export const addTaskNoteSuccess = (data) => {
  return {
    type: 'CLAIMS_TASK_ADD_NOTE_SUCCESS',
    payload: data,
  };
};

export const addTaskNoteFailure = (error) => {
  return {
    type: 'CLAIMS_TASK_ADD_NOTE_ERROR',
    payload: error,
  };
};
