import * as utils from 'utils';
import { authLogout, addLoader, removeLoader } from 'stores';

export const getMarketParentListAll = () => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}} = getState();

  dispatch(getMarketParentListAllRequest());
  dispatch(addLoader('getMarketParentListAll'));

  return utils.api
    .get({
      token: auth.accessToken,
      endpoint: endpoint.edge,
      path: 'api/marketParent/all',
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleData(json))
    .then((data) => {
      dispatch(getMarketParentListAllSuccess(data));
      dispatch(removeLoader('getMarketParentListAll'));
      return data;
    })
    .catch((err) => {
      const errorParams = {
        file: 'stores/marketParent.actions.getList',
        message: 'API fetch error (marketParent.getListAll)',
      };

      utils.api.handleError(err, errorParams);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(getMarketParentListAllFailure(err));
      dispatch(removeLoader('getMarketParentListAll'));
      return err;
    });
};

export const getMarketParentListAllRequest = () => {
  return {
    type: 'MARKET_PARENT_LIST_ALL_GET_REQUEST',
  };
};

export const getMarketParentListAllSuccess = (responseData) => {
  return {
    type: 'MARKET_PARENT_LIST_ALL_GET_SUCCESS',
    payload: responseData,
  };
};

export const getMarketParentListAllFailure = (error) => {
  return {
    type: 'MARKET_PARENT_LIST_GET_ALL_FAILURE',
    payload: error,
  };
};
