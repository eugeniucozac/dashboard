import { authLogout, addLoader, removeLoader } from 'stores';
import * as utils from 'utils';

export const getCurrencyPurchasedValue = (taskID) => (dispatch, getState) => {
  // prettier-ignore
  const {user: { auth }, config: { vars: { endpoint }}} = getState();

  const defaultError = {
    file: 'stores/claims.actions.getCurrencyPurchased',
  };

  dispatch(getCurrencyPurchasedValueRequest());
  dispatch(addLoader('getCurrencyPurchasedValue'));

  return utils.api
    .get({
      token: auth.accessToken,
      endpoint: endpoint.bpmService,
      path: `/workflow/process/task/${taskID}/purchaseCurrency`,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleNewData(json))
    .then((data) => {
      dispatch(getCurrencyPurchasedValueSuccess(data));
      return data;
    })
    .catch((err) => {
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(getCurrencyPurchasedValueFailure(err, defaultError));
      return err;
    })
    .finally(() => {
      dispatch(removeLoader('getCurrencyPurchasedValue'));
    });
};

export const getCurrencyPurchasedValueRequest = (data) => {
  return {
    type: 'CURRENCY_PURCHASED_VALUE_GET_REQUEST',
    payload: data,
  };
};

export const getCurrencyPurchasedValueSuccess = (data) => {
  return {
    type: 'CURRENCY_PURCHASED_VALUE_GET_SUCCESS',
    payload: data,
  };
};

export const getCurrencyPurchasedValueFailure = (error) => {
  return {
    type: 'CURRENCY_PURCHASED_VALUE_GET_FAILURE',
    payload: error,
  };
};
