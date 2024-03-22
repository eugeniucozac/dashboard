import { addLoader, authLogout, enqueueNotification, getRiskDetails, getRiskQuotes, hideModal, removeLoader } from 'stores';
import * as utils from 'utils';
import isEmpty from 'lodash/isEmpty';

export const patchRiskQuote =
  (formData, quote, accept = false) =>
  (dispatch, getState) => {
    // prettier-ignore
    const { user: { auth }, config: { vars: { endpoint }}} = getState();

    const defaultError = {
      file: 'stores/risk.actions.patchQuote',
      message: 'Data missing for POST request',
    };

    dispatch(patchQuoteRequest(formData));
    dispatch(addLoader('patchQuote'));

    if (!formData || isEmpty(formData) || isEmpty(quote) || !quote.id) {
      dispatch(patchQuoteFailure(defaultError));
      dispatch(enqueueNotification('notification.generic.request', 'error'));
      dispatch(hideModal());
      dispatch(removeLoader('patchQuote'));
      return;
    }

    const body = {
      ...quote,
      premium: formData.premium,
      grossPremium: formData.premium,
      validUntil: formData.validUntil,
    };

    const path = accept ? `api/v1/quotes/${quote.id}/patch?acceptQuote=true` : `api/v1/quotes/${quote.id}/patch`;

    return utils.api
      .post({
        token: auth.accessToken,
        endpoint: endpoint.auth,
        path,
        data: body,
      })
      .then((response) => utils.api.handleResponse(response))
      .then((json) => utils.api.handleResponseJsonObject(json))
      .then((data) => {
        dispatch(patchQuoteSuccess(data));
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
        dispatch(enqueueNotification('notification.patchRiskQuote.success', 'success'));
      })
      .catch((err) => {
        const errorParams = {
          ...defaultError,
          message: 'API post error (risk.patchQuote)',
        };

        utils.api.handleError(err, errorParams);
        utils.api.handleUnauthorized(err, dispatch, authLogout);
        dispatch(patchQuoteFailure(err));
        dispatch(enqueueNotification(utils.api.getErrorMessage(err), 'error'));
        return err;
      })
      .finally(() => {
        dispatch(hideModal());
        dispatch(removeLoader('patchQuote'));
        return;
      });
  };

export const patchQuoteRequest = (formData) => {
  return {
    type: 'RISK_PATCH_QUOTE_REQUEST',
    payload: formData,
  };
};

export const patchQuoteSuccess = (responseData) => {
  return {
    type: 'RISK_PATCH_QUOTE_SUCCESS',
    payload: responseData,
  };
};

export const patchQuoteFailure = (error) => {
  return {
    type: 'RISK_PATCH_QUOTE_FAILURE',
    payload: error,
  };
};
