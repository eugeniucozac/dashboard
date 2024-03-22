import get from 'lodash/get';

// app
import { authLogout } from 'stores';
import * as utils from 'utils';

export const getRiskList = (params) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}} = getState();

  const defaultError = {
    file: 'stores/risk.actions.getList',
  };

  const state = getState();
  const prevQuery = get(state, 'risk.list.query') || '';
  const isNewQuery = params && params.hasOwnProperty('query');
  const newQuery = isNewQuery ? params.query : prevQuery;

  const paramsSize = (params && params.size) || get(state, 'risk.list.pageSize');
  const paramsOrderBy = (params && params.orderBy) || get(state, 'risk.list.sortBy');
  const paramsDirection = (params && params.direction) || get(state, 'risk.list.sortDirection');

  const endpointParams = {
    page: (params && params.page) || 1,
    ...(paramsSize && { size: paramsSize }),
    ...(paramsOrderBy && { orderBy: paramsOrderBy }),
    ...(paramsDirection && { direction: paramsDirection }),
    ...(newQuery && { query: newQuery }),
  };

  dispatch(getRiskListRequest(endpointParams));

  return utils.api
    .get({
      token: auth.accessToken,
      endpoint: endpoint.auth,
      path: 'api/v1/risks',
      params: endpointParams,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleResponseJsonObject(json, 'content'))
    .then((data) => {
      dispatch(getRiskListSuccess(data));
    })
    .catch((err) => {
      utils.api.handleError(err, defaultError);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(getRiskListFailure(err));
      return err;
    });
};

export const updateRiskListItemsStatus = (id, riskStatus) => {
  return {
    type: 'RISK_LIST_UPDATE_ITEM_RISK_STATUS',
    payload: {
      riskId: id,
      riskStatus: riskStatus,
    },
  };
};

export const getRiskListRequest = (params) => {
  return {
    type: 'RISK_LIST_GET_REQUEST',
    payload: params,
  };
};

export const getRiskListSuccess = (data) => {
  return {
    type: 'RISK_LIST_GET_SUCCESS',
    payload: {
      content: data.content,
      pagination: data.pagination,
    },
  };
};

export const getRiskListFailure = (error) => {
  return {
    type: 'RISK_LIST_GET_FAILURE',
    payload: error,
  };
};
