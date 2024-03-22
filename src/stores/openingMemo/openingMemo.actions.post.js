import isString from 'lodash/isString';

// app
import { authLogout, enqueueNotification, addLoader, removeLoader, transformOpeningMemoOutPOST } from 'stores';
import * as utils from 'utils';

export const createOpeningMemo = (uniqueMarketReference, departmentId) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}} = getState();

  const defaultError = {
    file: 'stores/openingMemo.actions.post',
    message: 'Data missing for POST request',
  };

  dispatch(postOpeningMemoRequest({ uniqueMarketReference, departmentId }));
  dispatch(addLoader('createOpeningMemo'));

  if (!uniqueMarketReference || !isString(uniqueMarketReference)) {
    dispatch(postOpeningMemoFailure(defaultError));
    dispatch(enqueueNotification('notification.openingMemo.postFail', 'error'));
    dispatch(removeLoader('createOpeningMemo'));
    return;
  }

  const transformedPayload = transformOpeningMemoOutPOST({ uniqueMarketReference, departmentId });

  return utils.api
    .post({
      token: auth.accessToken,
      endpoint: endpoint.edge,
      path: 'api/openingMemo',
      data: transformedPayload,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleData(json))
    .then((data) => {
      dispatch(postOpeningMemoSuccess(data));
      dispatch(enqueueNotification('notification.openingMemo.postSuccess', 'success'));
    })
    .catch((err) => {
      const errorParams = {
        ...defaultError,
        message: 'API post error (openingMemo)',
      };

      utils.api.handleError(err, errorParams);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(postOpeningMemoFailure(err));
      dispatch(enqueueNotification('notification.openingMemo.postFail', 'error'));
      return err;
    })
    .finally(() => {
      dispatch(removeLoader('createOpeningMemo'));
    });
};

export const postOpeningMemoRequest = (payload) => {
  return {
    type: 'OPENING_MEMO_POST_REQUEST',
    payload,
  };
};

export const postOpeningMemoSuccess = (payload) => {
  return {
    type: 'OPENING_MEMO_POST_SUCCESS',
    payload,
  };
};

export const postOpeningMemoFailure = (error) => {
  return {
    type: 'OPENING_MEMO_POST_FAILURE',
    payload: error,
  };
};

export const resetOpeningMemoPostSuccess = () => ({
  type: 'RESET_OPENING_MEMO_POST_SUCCESS',
});
