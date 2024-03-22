import { addLoader, authLogout, enqueueNotification, getRiskDetails, getRiskQuotes, hideModal, removeLoader } from 'stores';
import * as utils from 'utils';
import isEmpty from 'lodash/isEmpty';

export const postRiskQuote = (formData) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}} = getState();

  const defaultError = {
    file: 'stores/risk.actions.postQuote',
    message: 'Data missing for POST request',
  };

  dispatch(postQuoteRequest(formData));
  dispatch(addLoader('postQuote'));

  if (!formData || !formData.facility || isEmpty(formData)) {
    dispatch(postQuoteFailure(defaultError));
    dispatch(enqueueNotification('notification.generic.request', 'error'));
    dispatch(hideModal());
    dispatch(removeLoader('postQuote'));
    return;
  }

  const { facility = '{}', ...data } = formData;

  const body = {
    ...data,
    ...JSON.parse(facility),
  };

  return utils.api
    .post({
      token: auth.accessToken,
      endpoint: endpoint.auth,
      path: 'api/v1/quotes',
      data: body,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleResponseJsonObject(json))
    .then((data) => {
      dispatch(postQuoteSuccess(data));
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
      dispatch(enqueueNotification('notification.postRiskQuote.success', 'success'));
    })
    .catch((err) => {
      const errorParams = {
        ...defaultError,
        message: 'API post error (risk.postQuote)',
      };

      utils.api.handleError(err, errorParams);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(postQuoteFailure(err));
      dispatch(enqueueNotification(utils.api.getErrorMessage(err), 'error'));
      return err;
    })
    .finally(() => {
      dispatch(hideModal());
      dispatch(removeLoader('postQuote'));
      return;
    });
};

export const postQuoteRequest = (formData) => {
  return {
    type: 'RISK_POST_QUOTE_REQUEST',
    payload: formData,
  };
};

export const postQuoteSuccess = (responseData) => {
  return {
    type: 'RISK_POST_QUOTE_SUCCESS',
    payload: responseData,
  };
};

export const postQuoteFailure = (error) => {
  return {
    type: 'RISK_POST_QUOTE_FAILURE',
    payload: error,
  };
};
