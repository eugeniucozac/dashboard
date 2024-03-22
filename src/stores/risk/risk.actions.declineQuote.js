import { addLoader, authLogout, enqueueNotification, getRiskDetails, getRiskQuotes, hideModal, removeLoader } from 'stores';
import * as utils from 'utils';

export const declineRiskQuote = (quoteId) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}} = getState();

  const defaultError = {
    file: 'stores/risk.actions.declineQuote',
  };

  dispatch(declineQuoteRequest(quoteId));
  dispatch(addLoader('declineQuote'));

  if (!quoteId) {
    dispatch(declineQuoteFailure({ ...defaultError, message: 'Data missing for POST request' }));
    dispatch(enqueueNotification('notification.generic.request', 'error'));
    dispatch(hideModal());
    dispatch(removeLoader('declineQuote'));
    return;
  }

  const path = `api/v1/quotes/${quoteId}/decline`;

  return utils.api
    .put({
      token: auth.accessToken,
      endpoint: endpoint.auth,
      path,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleResponseJsonObject(json))
    .then((data) => {
      dispatch(declineQuoteSuccess(data));
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
      dispatch(enqueueNotification('notification.declineRiskQuote.success', 'success'));
    })
    .catch((err) => {
      utils.api.handleError(err, defaultError);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(declineQuoteFailure(err));
      dispatch(enqueueNotification(utils.api.getErrorMessage(err), 'error'));
      return err;
    })
    .finally(() => {
      dispatch(hideModal());
      dispatch(removeLoader('declineQuote'));
      return;
    });
};

export const declineQuoteRequest = (id) => {
  return {
    type: 'RISK_DECLINE_QUOTE_REQUEST',
    payload: id,
  };
};

export const declineQuoteSuccess = (responseData) => {
  return {
    type: 'RISK_DECLINE_QUOTE_SUCCESS',
    payload: responseData,
  };
};

export const declineQuoteFailure = (error) => {
  return {
    type: 'RISK_DECLINE_QUOTE_FAILURE',
    payload: error,
  };
};
