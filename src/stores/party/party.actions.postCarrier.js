import { addLoader, authLogout, enqueueNotification, removeLoader, hideModal } from 'stores';
import * as utils from 'utils';
import isEmpty from 'lodash/isEmpty';

export const postCarrier = (body, isCreateCarrierModal) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}} = getState();

  const defaultError = {
    file: 'stores/risk.actions.postCarrier',
    message: 'Data missing for POST request',
  };

  dispatch(postCarrierRequest(body));
  dispatch(addLoader('postCarrier'));

  if (!body || isEmpty(body)) {
    dispatch(postCarrierFailure(defaultError));
    dispatch(enqueueNotification('notification.generic.request', 'error'));
    dispatch(removeLoader('postCarrier'));
    return;
  }

  return utils.api
    .post({
      token: auth.accessToken,
      endpoint: endpoint.auth,
      path: 'api/v1/carriers',
      data: body,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((data) => {
      dispatch(postCarrierSuccess(data));
      dispatch(enqueueNotification('notification.carrier.postSuccess', 'success'));
      return data;
    })
    .catch((err) => {
      const errorParams = {
        ...defaultError,
        message: 'API post error (risk.postCarrier)',
      };

      utils.api.handleError(err, errorParams);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(postCarrierFailure(err));
      dispatch(enqueueNotification(utils.api.getErrorMessage(err), 'error'));
      return err;
    })
    .finally(() => {
      dispatch(hideModal(isCreateCarrierModal ? 'ADD_PRODUCTS_CARRIER' : undefined));
      dispatch(removeLoader('postCarrier'));
    });
};

export const postCarrierRequest = (formData) => {
  return {
    type: 'CARRIER_POST_REQUEST',
    payload: formData,
  };
};

export const postCarrierSuccess = (responseData) => {
  return {
    type: 'CARRIER_POST_SUCCESS',
    payload: responseData,
  };
};

export const postCarrierFailure = (error) => {
  return {
    type: 'CARRIER_POST_FAILURE',
    payload: error,
  };
};
