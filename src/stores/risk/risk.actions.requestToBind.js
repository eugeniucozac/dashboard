import { addLoader, authLogout, enqueueNotification, removeLoader, postQuoteResponseSuccess } from 'stores';
import * as utils from 'utils';

export const requestToBind = (quote) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}} = getState();
  const quoteId = quote.id;

  const defaultError = {
    file: 'stores/risk.actions.requestToBind',
    message: 'Data missing for POST request',
  };

  dispatch(requestToBindRequest(quoteId));
  dispatch(addLoader('requestToBind'));

  if (!quoteId) {
    dispatch(requestToBindFailure(defaultError));
    dispatch(enqueueNotification('notification.generic.request', 'error'));
    dispatch(removeLoader('requestToBind'));
    return;
  }

  const path = `api/v1/quotes/${quoteId}/request-to-bind`;

  return utils.api
    .put({
      token: auth.accessToken,
      endpoint: endpoint.auth,
      path,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleResponseJsonObject(json))
    .then((data) => {
      dispatch(postQuoteResponseSuccess(data));
      return data;
    })
    .then(() => {
      dispatch(enqueueNotification('notification.patchRiskQuote.success', 'success'));
    })
    .catch((err) => {
      const errorParams = {
        ...defaultError,
        message: 'API post error (risk.requestToBind)',
      };

      utils.api.handleError(err, errorParams);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(requestToBindFailure(err));
      dispatch(enqueueNotification(utils.api.getErrorMessage(err), 'error'));
      return err;
    })
    .finally(() => {
      dispatch(removeLoader('requestToBind'));
      return;
    });
};

export const requestToBindRequest = (formData) => {
  return {
    type: 'RISK_REQUEST_TO_BIND_REQUEST',
    payload: formData,
  };
};

export const requestToBindFailure = (error) => {
  return {
    type: 'RISK_TO_BIND_REQUEST_FAILURE',
    payload: error,
  };
};
