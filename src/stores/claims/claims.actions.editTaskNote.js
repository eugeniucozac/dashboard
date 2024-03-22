import { authLogout, addLoader, removeLoader, enqueueNotification, hideModal } from 'stores';
import * as utils from 'utils';

export const editTaskNote = (formData, note) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}} = getState();

  const defaultError = {
    file: 'stores/claims.actions.editTaskNote',
  };

  dispatch(editTaskNoteRequest(formData, note));
  dispatch(addLoader('editTaskNote'));

  if (!formData?.details || !note?.caseIncidentNotesID) {
    dispatch(editTaskNoteFailure({ ...defaultError, message: 'Missing requests params' }));
    dispatch(removeLoader('editTaskNote'));
    return;
  }

  return utils.api
    .put({
      token: auth.accessToken,
      endpoint: endpoint.bpmService,
      path: 'notes/update',
      data: {
        caseIncidentNotesID: note.caseIncidentNotesID,
        notesDescription: formData.details,
      },
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleNewData(json))
    .then((data) => {
      dispatch(editTaskNoteSuccess(data.data));
      dispatch(enqueueNotification(utils.string.t('claims.notes.notifications.editNoteSuccess'), 'success'));
      return data;
    })
    .catch((error) => {
      dispatch(editTaskNoteFailure(error, defaultError));
      dispatch(enqueueNotification(utils.string.t('claims.notes.notifications.editNoteFailure'), 'error'));
      utils.api.handleUnauthorized(error, dispatch, authLogout);
      return error;
    })
    .finally(() => {
      dispatch(removeLoader('editTaskNote'));
      dispatch(hideModal());
    });
};

export const editTaskNoteRequest = (formData, note) => {
  return {
    type: 'CLAIMS_TASK_EDIT_NOTE_REQUEST',
    payload: { formData, note },
  };
};

export const editTaskNoteSuccess = (data) => {
  return {
    type: 'CLAIMS_TASK_EDIT_NOTE_SUCCESS',
    payload: data,
  };
};

export const editTaskNoteFailure = (error) => {
  return {
    type: 'CLAIMS_TASK_EDIT_NOTE_ERROR',
    payload: error,
  };
};
