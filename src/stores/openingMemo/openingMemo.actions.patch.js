// app
import { hideModal, removeLoader, addLoader, authLogout, enqueueNotification, transformOpeningMemoInPUT } from 'stores';
import * as utils from 'utils';

export const patchOpeningMemo = (changes, openingMemoId) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}} = getState();

  const defaultError = {
    file: 'stores/openingMemo.actions.patch',
    message: 'Data missing for PATCH request',
  };

  dispatch(patchOpeningMemoRequest(changes));
  dispatch(addLoader('patchOpeningMemo'));

  if (!changes || !openingMemoId) {
    dispatch(patchOpeningMemoFailure(defaultError));
    dispatch(enqueueNotification('notification.openingMemo.editFail', 'error'));
    dispatch(hideModal());
    dispatch(removeLoader('patchOpeningMemo'));
    return;
  }

  return utils.api
    .patch({
      token: auth.accessToken,
      endpoint: endpoint.edge,
      path: `api/openingMemo/${openingMemoId}`,
      data: changes,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleData(json))
    .then((data) => {
      const transformedPayload = transformOpeningMemoInPUT(data);
      dispatch(patchOpeningMemoSuccess(transformedPayload));
      dispatch(enqueueNotification('notification.openingMemo.editSuccess', 'success'));
    })
    .catch((err) => {
      const errorParams = {
        ...defaultError,
        message: 'API patch error (openingMemo)',
      };

      utils.api.handleError(err, errorParams);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(patchOpeningMemoFailure(err));
      dispatch(enqueueNotification('notification.openingMemo.editFail', 'error'));
      return err;
    })
    .finally(() => {
      dispatch(hideModal());
      dispatch(removeLoader('patchOpeningMemo'));
    });
};

export const patchOpeningMemoRequest = (payload) => {
  return {
    type: 'OPENING_MEMO_PATCH_REQUEST',
    payload,
  };
};

export const patchOpeningMemoSuccess = (payload) => {
  return {
    type: 'OPENING_MEMO_PATCH_SUCCESS',
    payload,
  };
};

export const patchOpeningMemoFailure = (error) => {
  return {
    type: 'OPENING_MEMO_PATCH_FAILURE',
    payload: error,
  };
};
