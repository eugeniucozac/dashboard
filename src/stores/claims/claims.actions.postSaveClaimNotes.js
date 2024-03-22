import { addLoader, removeLoader, enqueueNotification, hideModal, authLogout } from 'stores';
import * as utils from 'utils';

export const postSaveClaimNotes = (formData) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, user, config: { vars: { endpoint }}} = getState();

  const defaultError = {
    file: 'stores/claims.actions.postSaveClaimNotes',
  };
  const nowIsoString = utils.date.toISOString(new Date());
  const data = {
    ...formData,
    isActive: 1,
    caseIncidentNotesID: 0,
    seqNo: 0,
    createdBy: user.id,
    createdDate: nowIsoString,
    updatedBy: user.id,
    updatedDate: nowIsoString,
  };
  dispatch(postSaveClaimNotesRequest(data));
  dispatch(addLoader('postSaveClaimNotes'));

  return utils.api
    .post({
      token: auth.accessToken,
      endpoint: endpoint.bpmService,
      path: 'notes/save',
      data: data,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleNewData(json, true))
    .then((data) => {
      dispatch(postSaveClaimNotesSuccess(data.data));
      dispatch(enqueueNotification(data.message, 'success'));
      return data;
    })
    .catch((error) => {
      dispatch(postSaveClaimNotesFailure(error, defaultError));
      dispatch(enqueueNotification(error.json.message, 'error'));
      utils.api.handleUnauthorized(error, dispatch, authLogout);
      return error;
    })
    .finally(() => {
      dispatch(removeLoader('postSaveClaimNotes'));
      dispatch(hideModal());
    });
};

export const postSaveClaimNotesRequest = (data) => {
  return {
    type: 'CLAIMS_SAVE_NOTES_POST_REQUEST',
    payload: data,
  };
};

export const postSaveClaimNotesSuccess = (params) => {
  return {
    type: 'CLAIMS_SAVE_NOTES_POST_SUCCESS',
    payload: params,
  };
};

export const postSaveClaimNotesFailure = (error) => {
  return {
    type: 'CLAIMS_SAVE_NOTES_POST_ERROR',
    payload: error,
  };
};
