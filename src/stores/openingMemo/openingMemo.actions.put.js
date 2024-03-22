import get from 'lodash/get';

// app
import { removeLoader, addLoader, authLogout, enqueueNotification, transformOpeningMemoOutPUT, transformOpeningMemoInPUT } from 'stores';
import * as utils from 'utils';

export const updateOpeningMemo = (changes, openingMemoId) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}} = getState();

  const openingMemo = get(getState(), 'openingMemo.selected');

  const defaultError = {
    file: 'stores/openingMemo.actions.put',
    message: 'Data missing for PUT request',
  };

  dispatch(putOpeningMemoRequest(changes));
  dispatch(addLoader('updateOpeningMemo'));

  if (!changes || !openingMemoId || !openingMemo) {
    dispatch(putOpeningMemoFailure(defaultError));
    dispatch(enqueueNotification('notification.openingMemo.editFail', 'error'));
    dispatch(removeLoader('updateOpeningMemo'));
    return;
  }

  const transformedPayload = transformOpeningMemoOutPUT(changes, openingMemo);

  return utils.api
    .put({
      token: auth.accessToken,
      endpoint: endpoint.edge,
      path: `api/openingMemo/${openingMemoId}`,
      data: transformedPayload,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleData(json))
    .then((data) => {
      const transformedPayload = transformOpeningMemoInPUT(data);
      dispatch(putOpeningMemoSuccess(transformedPayload));
      dispatch(enqueueNotification('notification.openingMemo.editSuccess', 'success'));
    })
    .catch((err) => {
      const errorParams = {
        ...defaultError,
        message: 'API put error (openingMemo)',
      };

      utils.api.handleError(err, errorParams);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(putOpeningMemoFailure(err));
      dispatch(enqueueNotification('notification.openingMemo.editFail', 'error'));
      return err;
    })
    .finally(() => {
      dispatch(removeLoader('updateOpeningMemo'));
    });
};

export const putOpeningMemoRequest = (payload) => {
  return {
    type: 'OPENING_MEMO_PUT_REQUEST',
    payload,
  };
};

export const putOpeningMemoSuccess = (payload) => {
  return {
    type: 'OPENING_MEMO_PUT_SUCCESS',
    payload,
  };
};

export const putOpeningMemoFailure = (error) => {
  return {
    type: 'OPENING_MEMO_PUT_FAILURE',
    payload: error,
  };
};
