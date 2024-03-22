import { addLoader, authLogout, enqueueNotification, getRiskDetails, getRiskQuotes, hideModal, removeLoader } from 'stores';
import * as utils from 'utils';

export const acceptRiskQuote = (quoteId) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}} = getState();

  const defaultError = {
    file: 'stores/risk.actions.acceptQuote',
  };

  dispatch(acceptQuoteRequest(quoteId));
  dispatch(addLoader('acceptQuote'));

  if (!quoteId) {
    dispatch(acceptQuoteFailure({ ...defaultError, message: 'Data missing for POST request' }));
    dispatch(enqueueNotification('notification.generic.request', 'error'));
    dispatch(hideModal());
    dispatch(removeLoader('acceptQuote'));
    return;
  }

  const path = `api/v1/quotes/${quoteId}/accept`;

  return utils.api
    .put({
      token: auth.accessToken,
      endpoint: endpoint.auth,
      path,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleResponseJsonObject(json))
    .then((data) => {
      dispatch(acceptQuoteSuccess(data));
      return data;
    })
    .then((data) => {
      dispatch(getRiskDetails(data.riskId));
      return data.riskId;
    })
    .then((riskId) => {
      return dispatch(getRiskQuotes(riskId));
    })
    .then(() => {
      dispatch(enqueueNotification('notification.acceptRiskQuote.success', 'success'));
    })
    .catch((err) => {
      utils.api.handleError(err, defaultError);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(acceptQuoteFailure(err));
      dispatch(enqueueNotification(utils.api.getErrorMessage(err), 'error'));
      return err;
    })
    .finally(() => {
      dispatch(hideModal());
      dispatch(removeLoader('acceptQuote'));
      return;
    });
};

export const acceptQuoteRequest = (id) => {
  return {
    type: 'RISK_ACCEPT_QUOTE_REQUEST',
    payload: id,
  };
};

export const acceptQuoteSuccess = (responseData) => {
  return {
    type: 'RISK_ACCEPT_QUOTE_SUCCESS',
    payload: responseData,
  };
};

export const acceptQuoteFailure = (error) => {
  return {
    type: 'RISK_ACCEPT_QUOTE_FAILURE',
    payload: error,
  };
};
