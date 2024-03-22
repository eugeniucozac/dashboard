// app
import { authLogout } from 'stores';
import * as utils from 'utils';
import get from 'lodash/get';

export const getClients = (params) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}} = getState();

  const defaultError = {
    file: 'stores/party.actions.getClients',
  };

  const state = getState();
  const paramsSize = (params && params.size) || get(state, 'party.clients.pageSize');
  const paramsOrderBy = (params && params.orderBy) || get(state, 'party.clients.sortBy');
  const paramsDirection = (params && params.direction) || get(state, 'party.clients.sortDirection');

  const endpointParams = {
    page: (params && params.page) || 1,
    ...(paramsSize && { size: paramsSize }),
    ...(paramsOrderBy && { orderBy: paramsOrderBy }),
    ...(paramsDirection && { direction: paramsDirection }),
  };

  dispatch(getClientsRequest(endpointParams));

  return utils.api
    .get({
      token: auth.accessToken,
      endpoint: endpoint.auth,
      path: 'api/v1/clients',
      params: endpointParams,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((data) => {
      dispatch(getClientsSuccess(data));
    })
    .catch((err) => {
      utils.api.handleError(err, defaultError);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(getClientsFailure(err));
      return err;
    });
};

export const getClientsRequest = () => {
  return {
    type: 'CLIENTS_GET_REQUEST',
  };
};

export const getClientsSuccess = (payload) => {
  return {
    type: 'CLIENTS_GET_SUCCESS',
    payload: {
      content: payload.content,
      pagination: payload.pagination,
    },
  };
};

export const getClientsFailure = (error) => {
  return {
    type: 'CLIENTS_GET_FAILURE',
    payload: error,
  };
};
