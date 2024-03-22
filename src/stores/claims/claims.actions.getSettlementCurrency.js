import { addLoader, authLogout, removeLoader } from 'stores';
import * as utils from 'utils';

export const getSettlementCurrency = () => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}} = getState();

  const defaultError = {
    file: 'stores/claims.actions.getSettlementCurrency',
  };

  dispatch(getSettlementCurrencyRequest());
  dispatch(addLoader('getSettlementCurrency'));

  return utils.api
    .get({
      token: auth.accessToken,
      endpoint: endpoint.claimService,
      path: 'api/data/gui/settlement-currency',
    })
    .then((response) => utils.api.handleResponse(response))
    .then((data) => {
      dispatch(getSettlementCurrencySuccess(data.data));
      dispatch(removeLoader('getSettlementCurrency'));
      return data.data;
    })
    .catch((err) => {
      dispatch(getSettlementCurrencyFailure(err, defaultError));
      dispatch(removeLoader('getSettlementCurrency'));
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      return err;
    });
};

export const getSettlementCurrencyRequest = (data) => {
  return {
    type: 'CLAIMS_SETTLEMENT_CURRENCY_GET_REQUEST',
    payload: data,
  };
};

export const getSettlementCurrencySuccess = (data) => {
  return {
    type: 'CLAIMS_SETTLEMENT_CURRENCY_GET_SUCCESS',
    payload: data,
  };
};

export const getSettlementCurrencyFailure = (data) => {
  return {
    type: 'CLAIMS_SETTLEMENT_CURRENCY_GET_FAILURE',
    payload: data,
  };
};
