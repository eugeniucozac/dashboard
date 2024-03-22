import { addLoader, authLogout, removeLoader, enqueueNotification, hideModal } from 'stores';
import * as utils from 'utils';

export const addEditMarkets = (marketParent) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}} = getState();

  dispatch(addEditMarketsRequest(marketParent));
  dispatch(addLoader('addEditMarkets'));

  const defaultError = {
    file: 'stores/marketParent.actions.addEditMarkets',
  };

  if (!utils.generic.isValidObject(marketParent) || !marketParent.id || !utils.generic.isValidArray(marketParent.markets, true)) {
    dispatch(addEditMarketsFailure(defaultError));
    dispatch(enqueueNotification('notification.marketParent.putFail', 'error'));
    dispatch(removeLoader('addEditMarkets'));
    dispatch(hideModal());
    return;
  }

  const marketParentObj = { ...marketParent };
  const markets = marketParentObj.markets.filter((market) => !market.__isNew__);
  const nonPFMarkets = marketParentObj.markets.filter((market) => market.__isNew__);

  delete marketParentObj.markets;

  const body = {
    ...marketParentObj,
    ...(utils.generic.isValidArray(markets, true) && { markets }),
    ...(utils.generic.isValidArray(nonPFMarkets, true) && { nonPFMarkets: nonPFMarkets.map((m) => ({ name: m.name })) }),
  };

  return utils.api
    .put({
      token: auth.accessToken,
      endpoint: endpoint.edge,
      path: `api/marketParent/${marketParentObj.id}`,
      data: body,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleData(json))
    .then((data) => {
      dispatch(addEditMarketsSuccess(data));
      dispatch(enqueueNotification('notification.marketParent.putSuccess', 'success'));
      return data;
    })
    .catch((err) => {
      utils.api.handleError(err, defaultError);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(addEditMarketsFailure(err));
      dispatch(enqueueNotification('notification.marketParent.putFail', 'error'));
      return err;
    })
    .finally(() => {
      dispatch(removeLoader('addEditMarkets'));
      dispatch(hideModal());
    });
};

export const addEditMarketsRequest = (payload) => {
  return {
    type: 'MARKET_PARENT_EDIT_MARKETS_REQUEST',
    payload,
  };
};

export const addEditMarketsSuccess = (payload) => {
  return {
    type: 'MARKET_PARENT_EDIT_MARKETS_SUCCESS',
    payload,
  };
};

export const addEditMarketsFailure = (error) => {
  return {
    type: 'MARKET_PARENT_EDIT_MARKETS_FAILURE',
    payload: error,
  };
};
