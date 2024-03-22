import { addLoader, authLogout, enqueueNotification, hideModal, removeLoader } from 'stores';
import * as utils from 'utils';
import isEmpty from 'lodash/isEmpty';

export const patchUserProgrammes = (programmesUserId, data) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}} = getState();

  const defaultError = {
    file: 'stores/admin.actions.patchUserProgrammes',
    message: 'Data missing for PATCH request',
  };

  dispatch(patchUserProgrammesRequest(data));
  dispatch(addLoader('patchUserProgrammes'));

  if (!data || isEmpty(data)) {
    dispatch(patchUserProgrammesFailure(defaultError));
    dispatch(enqueueNotification('notification.generic.request', 'error'));
    dispatch(hideModal());
    dispatch(removeLoader('patchQuote'));
    return;
  }

  const path = `api/v1/users/edge/${programmesUserId}`;

  return utils.api
    .patch({
      token: auth.accessToken,
      endpoint: endpoint.auth,
      path,
      data,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleResponseJsonObject(json))
    .then((data) => {
      dispatch(patchUserProgrammesSuccess(data));
      return data;
    })

    .then(() => {
      dispatch(enqueueNotification('notification.patchUserProgrammes.success', 'success'));
    })
    .catch((err) => {
      const errorParams = {
        ...defaultError,
        message: 'API post error (admin.patchUserProgrammes)',
      };

      utils.api.handleError(err, errorParams);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(patchUserProgrammesFailure(err));
      dispatch(enqueueNotification(utils.api.getErrorMessage(err), 'error'));
      return err;
    })
    .finally(() => {
      dispatch(hideModal());
      dispatch(removeLoader('patchUserProgrammes'));
      return;
    });
};

export const patchUserProgrammesRequest = (formData) => {
  return {
    type: 'USER_PROGRAMMES_PATCH_REQUEST',
    payload: formData,
  };
};

export const patchUserProgrammesSuccess = (responseData) => {
  return {
    type: 'USER_PROGRAMMES_PATCH_SUCCESS',
    payload: responseData,
  };
};

export const patchUserProgrammesFailure = (error) => {
  return {
    type: 'USER_PROGRAMMES_PATCH_FAILURE',
    payload: error,
  };
};
