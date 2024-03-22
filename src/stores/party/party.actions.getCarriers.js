// app
import { authLogout } from 'stores';
import * as utils from 'utils';
import get from 'lodash/get';

export const getCarriers = (params) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}} = getState();

  const defaultError = {
    file: 'stores/party.actions.getCarriers',
  };

  const state = getState();
  const paramsSize = (params && params.size) || get(state, 'party.carriers.pageSize');
  const paramsOrderBy = (params && params.orderBy) || get(state, 'party.carriers.sortBy');
  const paramsDirection = (params && params.direction) || get(state, 'party.carriers.sortDirection');

  const endpointParams = {
    page: (params && params.page) || 1,
    ...(paramsSize && { size: paramsSize }),
    ...(paramsOrderBy && { orderBy: paramsOrderBy }),
    ...(paramsDirection && { direction: paramsDirection }),
  };

  dispatch(getCarriersRequest(endpointParams));

  return utils.api
    .get({
      token: auth.accessToken,
      endpoint: endpoint.auth,
      path: 'api/v1/carriers',
      params: endpointParams,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((data) => {
      dispatch(getCarriersSuccess(data));
      return data;
    })
    .catch((err) => {
      utils.api.handleError(err, defaultError);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(getCarriersFailure(err));
      return err;
    });
};

export const getCarriersRequest = () => {
  return {
    type: 'CARRIERS_GET_REQUEST',
  };
};

export const getCarriersSuccess = (payload) => {
  return {
    type: 'CARRIERS_GET_SUCCESS',
    payload: {
      content: payload?.content ? payload.content : payload,
      pagination: payload?.pagination,
    },
  };
};

export const getCarriersFailure = (error) => {
  return {
    type: 'CARRIERS_GET_FAILURE',
    payload: error,
  };
};
