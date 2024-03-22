import * as utils from 'utils';
import { authLogout, addLoader, removeLoader } from 'stores';

export const getMarketParentList = () => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}} = getState();

  dispatch(getMarketParentListRequest());
  dispatch(addLoader('getMarketParentList'));

  return utils.api
    .get({
      token: auth.accessToken,
      endpoint: endpoint.edge,
      path: 'api/marketParent',
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleData(json))
    .then((data) => {
      dispatch(getMarketParentListSuccess(data));
      dispatch(removeLoader('getMarketParentList'));
      return data;
    })
    .catch((err) => {
      const errorParams = {
        file: 'stores/marketParent.actions.getList',
        message: 'API fetch error (marketParent.getList)',
      };

      utils.api.handleError(err, errorParams);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(getMarketParentListFailure(err));
      dispatch(removeLoader('getMarketParentList'));
      return err;
    });
};

export const getMarketParentListRequest = () => {
  return {
    type: 'MARKET_PARENT_LIST_GET_REQUEST',
  };
};

export const getMarketParentListSuccess = (responseData) => {
  return {
    type: 'MARKET_PARENT_LIST_GET_SUCCESS',
    payload: responseData,
  };
};

export const getMarketParentListFailure = (error) => {
  return {
    type: 'MARKET_PARENT_LIST_GET_FAILURE',
    payload: error,
  };
};
