import { addLoader, authLogout, enqueueNotification, getRiskDetails, hideModal, removeLoader } from 'stores';
import * as utils from 'utils';

export const postRiskQuoteResponse =
  ({ quoteId, riskId, ...formData }) =>
  (dispatch, getState) => {
    // prettier-ignore
    const { user: { auth }, config: { vars: { endpoint }}} = getState();

    const defaultError = {
      file: 'stores/risk.actions.postQuoteResponse',
      message: 'Data missing for POST request',
    };

    dispatch(postQuoteResponseRequest({ quoteId, riskId, ...formData }));
    dispatch(addLoader('postQuoteResponse'));

    if (!formData || !riskId || !quoteId || !formData.effectiveFrom || !formData.effectiveTo) {
      dispatch(postQuoteResponseFailure(defaultError));
      dispatch(enqueueNotification('notification.generic.request', 'error'));
      dispatch(hideModal());
      dispatch(removeLoader('postQuoteResponse'));
      return;
    }

    return utils.api
      .post({
        token: auth.accessToken,
        endpoint: endpoint.auth,
        path: `api/v1/quotes/${quoteId}/response`,
        data: formData,
      })
      .then((response) => utils.api.handleResponse(response))
      .then((json) => utils.api.handleResponseJsonObject(json))
      .then((data) => {
        dispatch(postQuoteResponseSuccess(data));
        return data;
      })
      .then((data) => {
        return dispatch(getRiskDetails(data.riskId));
      })
      .then(() => {
        dispatch(enqueueNotification('notification.postRiskQuoteBind.success', 'success'));
      })
      .catch((err) => {
        const errorParams = {
          ...defaultError,
          message: 'API post error (risk.postQuoteResponse)',
        };

        utils.api.handleError(err, errorParams);
        utils.api.handleUnauthorized(err, dispatch, authLogout);
        dispatch(postQuoteResponseFailure(err));
        dispatch(enqueueNotification(utils.api.getErrorMessage(err), 'error'));
        return err;
      })
      .finally(() => {
        dispatch(hideModal());
        dispatch(removeLoader('postQuoteResponse'));
      });
  };

export const postQuoteResponseRequest = (formData) => {
  return {
    type: 'RISK_POST_QUOTE_RESPONSE_REQUEST',
    payload: formData,
  };
};

export const postQuoteResponseSuccess = (responseData) => {
  return {
    type: 'RISK_POST_QUOTE_RESPONSE_SUCCESS',
    payload: responseData,
  };
};

export const postQuoteResponseFailure = (error) => {
  return {
    type: 'RISK_POST_QUOTE_RESPONSE_FAILURE',
    payload: error,
  };
};
