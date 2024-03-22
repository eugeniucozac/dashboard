// app
import { authLogout } from 'stores';
import * as utils from 'utils';
import get from 'lodash/get';

export const getReinsureds = (params) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}} = getState();

  const defaultError = {
    file: 'stores/party.actions.getReinsureds',
  };

  const state = getState();
  const paramsSize = (params && params.size) || get(state, 'party.reinsureds.pageSize');
  const paramsOrderBy = (params && params.orderBy) || get(state, 'party.reinsureds.sortBy');
  const paramsDirection = (params && params.direction) || get(state, 'party.reinsureds.sortDirection');

  const endpointParams = {
    page: (params && params.page) || 1,
    ...(paramsSize && { size: paramsSize }),
    ...(paramsOrderBy && { orderBy: paramsOrderBy }),
    ...(paramsDirection && { direction: paramsDirection }),
  };

  dispatch(getReinsuredsRequest(endpointParams));

  return utils.api
    .get({
      token: auth.accessToken,
      endpoint: endpoint.auth,
      path: 'api/v1/reinsured',
      params: endpointParams,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((data) => {
      dispatch(getReinsuredsSuccess(data));
    })
    .catch((err) => {
      utils.api.handleError(err, defaultError);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(getReinsuredsFailure(err));
      return err;
    });
};

export const getReinsuredsRequest = () => {
  return {
    type: 'REINSUREDS_GET_REQUEST',
  };
};

export const getReinsuredsSuccess = (payload) => {
  return {
    type: 'REINSUREDS_GET_SUCCESS',
    payload: {
      content: payload.content,
      pagination: payload.pagination,
    },
  };
};

export const getReinsuredsFailure = (error) => {
  return {
    type: 'REINSUREDS_GET_FAILURE',
    payload: error,
  };
};
