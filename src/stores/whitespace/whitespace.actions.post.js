import isEmpty from 'lodash/isEmpty';
import get from 'lodash/get';

// app
import { authLogout, hideModal, removeLoader, addLoader, enqueueNotification } from 'stores';
import * as utils from 'utils';

export const createWhitespacePolicy = (formData) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}} = getState();

  const defaultError = {
    file: 'stores/whitespace.actions.post',
  };

  dispatch(createWhitespaceRequest(formData));
  dispatch(addLoader('createWhitespacePolicy'));

  if (!formData || isEmpty(formData)) {
    dispatch(createWhitespaceFailure(defaultError));
    dispatch(enqueueNotification('notification.createWhitespacePolicy.fail', 'error'));
    dispatch(hideModal());
    dispatch(removeLoader('createWhitespacePolicy'));
    return;
  }

  const state = getState();
  const placement = get(state, 'placement.selected') || {};
  const { umrId, ...rest } = formData;
  const body = {
    insuredName: utils.placement.getInsureds(placement),
    ...rest,
  };

  return utils.api
    .post({
      token: auth.accessToken,
      endpoint: endpoint.whitespace,
      path: `api/v1/mrcContracts/${umrId}`,
      data: body,
    })
    .then((response) => utils.api.handleResponse(response))
    .then(() => {
      dispatch(createWhitespaceSuccess());
      dispatch(enqueueNotification('notification.createWhitespacePolicy.success', 'success'));
    })
    .catch((err) => {
      const errorParams = {
        ...defaultError,
        message: 'API post error (whitespace.postCreate)',
      };
      utils.api.handleError(err, errorParams);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(createWhitespaceFailure(err));
      dispatch(enqueueNotification('notification.createWhitespacePolicy.fail', 'error'));
      return err;
    })
    .finally(() => {
      dispatch(hideModal());
      dispatch(removeLoader('createWhitespacePolicy'));
    });
};

export const createWhitespaceRequest = (payload) => {
  return {
    type: 'CREATE_WHITESPACE_POST_REQUEST',
    payload,
  };
};

export const createWhitespaceSuccess = () => {
  return {
    type: 'CREATE_WHITESPACE_POST_SUCCESS',
  };
};

export const createWhitespaceFailure = (error) => {
  return {
    type: 'CREATE_WHITESPACE_POST_FAILURE',
    payload: error,
  };
};
