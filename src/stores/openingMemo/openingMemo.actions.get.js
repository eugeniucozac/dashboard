// app
import { authLogout, addLoader, removeLoader, transformOpeningMemoInPUT } from 'stores';
import * as utils from 'utils';

export const getOpeningMemo = (openingMemoId) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}} = getState();

  const defaultError = {
    file: 'stores/openingMemo.actions.get',
  };

  dispatch(getOpeningMemoRequest(openingMemoId));
  dispatch(addLoader('openingMemo'));

  if (!openingMemoId) {
    dispatch(getOpeningMemoFailure(defaultError));
    dispatch(removeLoader('getOpeningMemo'));
  }

  return utils.api
    .get({
      token: auth.accessToken,
      endpoint: endpoint.edge,
      path: `api/openingMemo/${openingMemoId}`,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleData(json))
    .then((data) => {
      const transformedData = transformOpeningMemoInPUT(data);
      dispatch(getOpeningMemoSuccess(transformedData));
    })
    .catch((err) => {
      utils.api.handleError(err, defaultError);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(getOpeningMemoFailure(err));
      return err;
    })
    .finally(() => {
      dispatch(removeLoader('openingMemo'));
    });
};

export const getOpeningMemoRequest = (payload) => {
  return {
    type: 'OPENING_MEMO_GET_REQUEST',
    payload,
  };
};

export const getOpeningMemoSuccess = (payload) => {
  return {
    type: 'OPENING_MEMO_GET_SUCCESS',
    payload,
  };
};

export const getOpeningMemoFailure = (error) => {
  return {
    type: 'OPENING_MEMO_GET_FAILURE',
    payload: error,
  };
};
