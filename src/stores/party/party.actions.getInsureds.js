// app
import { authLogout } from 'stores';
import * as utils from 'utils';
import get from 'lodash/get';

export const getInsureds = (params) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}} = getState();

  const defaultError = {
    file: 'stores/party.actions.getInsureds',
  };

  const state = getState();
  const paramsSize = (params && params.size) || get(state, 'party.insureds.pageSize');
  const paramsOrderBy = (params && params.orderBy) || get(state, 'party.insureds.sortBy');
  const paramsDirection = (params && params.direction) || get(state, 'party.insureds.sortDirection');

  const endpointParams = {
    page: (params && params.page) || 1,
    ...(paramsSize && { size: paramsSize }),
    ...(paramsOrderBy && { orderBy: paramsOrderBy }),
    ...(paramsDirection && { direction: paramsDirection }),
  };

  dispatch(getInsuredsRequest(endpointParams));

  return utils.api
    .get({
      token: auth.accessToken,
      endpoint: endpoint.auth,
      path: 'api/v1/insured',
      params: endpointParams,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((data) => {
      dispatch(getInsuredsSuccess(data));
    })
    .catch((err) => {
      utils.api.handleError(err, defaultError);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(getInsuredsFailure(err));
      return err;
    });
};

export const getInsuredsRequest = () => {
  return {
    type: 'INSUREDS_GET_REQUEST',
  };
};

export const getInsuredsSuccess = (payload) => {
  return {
    type: 'INSUREDS_GET_SUCCESS',
    payload: {
      content: payload.content,
      pagination: payload.pagination,
    },
  };
};

export const getInsuredsFailure = (error) => {
  return {
    type: 'INSUREDS_GET_FAILURE',
    payload: error,
  };
};
