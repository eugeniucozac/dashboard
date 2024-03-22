// app
import * as utils from 'utils';
import { authLogout, addLoader, enqueueNotification, hideModal, removeLoader } from 'stores';
export const getEditClaimRefNotes = (formData) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint } } } = getState();
  const defaultError = {
    file: 'stores/claims.actions.getEditClaimRefNotes',
  };
  dispatch(getEditClaimRefNotesRequest(formData));
  dispatch(addLoader('getEditClaimRefNotes'));
  if (!formData || (!formData.caseIncidentNotesID && !formData.notesDescription)) {
    dispatch(getEditClaimRefNotesFailure(defaultError));
    dispatch(enqueueNotification('notification.setPriority.fail', 'error'));
    dispatch(removeLoader('getEditClaimRefNotes'));
    return;
  }

  const { caseIncidentNotesID, notesDescription } = formData;

  return utils.api
    .put({
      token: auth.accessToken,
      endpoint: endpoint.bpmService,
      path: 'notes/update',
      data: { caseIncidentNotesID, notesDescription },
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => {
      dispatch(getEditClaimRefNotesSuccess(json));
      dispatch(enqueueNotification('notification.claimRefNotes.success', 'success'));
      dispatch(hideModal());
      return json.data;
    })
    .catch((err) => {
      const errorParams = {
        ...defaultError,
        message: 'API fetch error (claims.actions.getEditClaimRefNotes)',
      };
      utils.api.handleError(err, errorParams);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(getEditClaimRefNotesFailure(err));
      dispatch(enqueueNotification('notification.claimRefNotes.fail', 'error'));
      return err;
    })
    .finally(() => {
      dispatch(removeLoader('getEditClaimRefNotes'));
    });
};
export const getEditClaimRefNotesRequest = (params) => {
  return {
    type: 'CLAIMREF_EDIT_NOTES_REQUEST',
    payload: params,
  };
};
export const getEditClaimRefNotesSuccess = (json) => {
  return {
    type: 'CLAIMREF_EDIT_NOTES_SUCCESS',
    payload: json?.data,
  };
};
export const getEditClaimRefNotesFailure = (error) => {
  return {
    type: 'CLAIMREF_EDIT_NOTES_FAILURE',
    payload: error,
  };
};
