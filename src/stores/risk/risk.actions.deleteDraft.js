import { addLoader, authLogout, enqueueNotification, hideModal, removeLoader } from 'stores';
import * as utils from 'utils';

export const deleteDraft = (draftId, isSubmitted) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint } } } = getState();

  const defaultError = {
    file: 'stores/risk.actions.deleteDraft',
    message: 'Data missing for DELETE request',
  };

  dispatch(deleteDraftRequest(draftId));
  dispatch(addLoader('deleteDraft'));

  if (!draftId) {
    dispatch(deleteDraftFailure(defaultError));
    dispatch(enqueueNotification('notification.deleteDraft.fail', 'error'));
    dispatch(hideModal());
    dispatch(removeLoader('deleteDraft'));
    return;
  }

  return utils.api
    .delete({
      token: auth.accessToken,
      endpoint: endpoint.auth,
      path: `api/v1/risks/drafts/${draftId}`,
    })
    .then(() => {
      dispatch(deleteDraftSuccess(draftId));
      if (!isSubmitted) {
        dispatch(enqueueNotification('notification.deleteDraft.success', 'success'));
        dispatch(hideModal());
      }
      dispatch(removeLoader('deleteDraft'));
    })
    .catch((err) => {
      const errorParams = {
        ...defaultError,
        message: 'API delete error (risk.deleteDraft)',
      };
      utils.api.handleError(err, errorParams);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(deleteDraftFailure(err));
      dispatch(enqueueNotification('notification.deleteDraft.fail', 'error'));
      dispatch(hideModal());
      dispatch(removeLoader('deleteDraft'));
      return err;
    });
};

export const deleteDraftRequest = (draftId) => {
  return {
    type: 'DRAFT_DELETE_REQUEST',
    payload: draftId,
  };
};

export const deleteDraftSuccess = (draftId) => {
  return {
    type: 'DRAFT_DELETE_SUCCESS',
    payload: draftId,
  };
};

export const deleteDraftFailure = (error) => {
  return {
    type: 'DRAFT_DELETE_FAILURE',
    payload: error,
  };
};
