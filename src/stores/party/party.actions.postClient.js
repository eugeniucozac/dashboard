import { addLoader, authLogout, enqueueNotification, removeLoader, hideModal } from 'stores';
import * as utils from 'utils';
import isEmpty from 'lodash/isEmpty';
import get from 'lodash/get';

export const postClient =
  (body, isCreateClientModal, isEdit = false) =>
  (dispatch, getState) => {
    // prettier-ignore
    const { user: { auth }, config: { vars: { endpoint }}} = getState();

    const defaultError = {
      file: 'stores/risk.actions.postClient',
      message: 'Data missing for POST request',
    };

    dispatch(postClientRequest(body));
    dispatch(addLoader('postClient'));

    const success = isEdit ? 'postEditSuccess' : 'postSuccess';
    const successNotification = `notification.client.${success}`;

    if (!body || isEmpty(body)) {
      dispatch(postClientFailure(defaultError));
      dispatch(enqueueNotification('notification.generic.request', 'error'));
      dispatch(removeLoader('postClient'));
      return;
    }

    return utils.api
      .post({
        token: auth.accessToken,
        endpoint: endpoint.auth,
        path: 'api/v1/clients',
        data: {
          ...(body?.id && { id: body.id }),
          name: body.name || '',
          address: {
            street: body.street || '',
            city: body.city || '',
            zipCode: body.zipCode || '',
            county: body.county || '',
            state: body.state || '',
            country: get(body, 'country.value', ''),
            distanceToCoast: '',
          },
        },
      })
      .then((response) => utils.api.handleResponse(response))
      .then((data) => {
        dispatch(postClientSuccess(data, isEdit));
        dispatch(enqueueNotification(successNotification, 'success'));
        return data;
      })
      .catch((err) => {
        const errorParams = {
          ...defaultError,
          message: 'API post error (risk.postClient)',
        };

        utils.api.handleError(err, errorParams);
        utils.api.handleUnauthorized(err, dispatch, authLogout);
        dispatch(postClientFailure(err));
        dispatch(enqueueNotification(utils.api.getErrorMessage(err), 'error'));
        return err;
      })
      .finally(() => {
        dispatch(hideModal(isCreateClientModal ? (isEdit ? 'EDIT_PRODUCTS_CLIENT' : 'ADD_PRODUCTS_CLIENT') : undefined));
        dispatch(removeLoader('postClient'));
      });
  };

export const postClientRequest = (formData) => {
  return {
    type: 'CLIENT_POST_REQUEST',
    payload: formData,
  };
};

export const postClientSuccess = (responseData, isEdit) => {
  return {
    type: isEdit ? 'CLIENT_POST_EDIT_SUCCESS' : 'CLIENT_POST_SUCCESS',
    payload: responseData,
  };
};

export const postClientFailure = (error) => {
  return {
    type: 'CLIENT_POST_FAILURE',
    payload: error,
  };
};
