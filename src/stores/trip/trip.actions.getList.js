import get from 'lodash/get';

// app
import { addLoader, authLogout, removeLoader, getTripById } from 'stores';
import * as utils from 'utils';

export const getTripList = (params) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}} = getState();

  const defaultError = {
    file: 'stores/trip.actions.getList',
  };

  const state = getState();
  const prevQuery = get(state, 'trip.list.query') || '';
  const isNewQuery = params && params.hasOwnProperty('query');
  const newQuery = isNewQuery ? params.query : prevQuery;

  const endpointParams = {
    page: (params && params.page) || 1,
    size: (params && params.size) || get(state, 'trip.list.pageSize'),
    orderBy: (params && params.orderBy) || get(state, 'trip.list.sortBy'),
    direction: (params && params.direction) || get(state, 'trip.list.sortDirection'),
    ...(newQuery && { query: newQuery }),
  };

  dispatch(getTripListRequest(endpointParams));
  dispatch(addLoader('getTripList'));

  return utils.api
    .get({
      token: auth.accessToken,
      endpoint: endpoint.edge,
      path: 'api/trip',
      params: endpointParams,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleData(json))
    .then((data) => {
      dispatch(getTripListSuccess(data));

      // if trip selected exists, don't change the selected trip
      // if trip selected isn't defined, select the first item in the list
      if (!get(state, 'trip.selected.id') && utils.generic.isValidArray(data.content, true)) {
        dispatch(getTripById(get(data, 'content[0].id'), true));
      }

      return data;
    })
    .catch((err) => {
      utils.api.handleError(err, defaultError);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(getTripListFailure(err));
      return err;
    })
    .finally(() => {
      dispatch(removeLoader('getTripList'));
    });
};

export const getTripListRequest = (params) => {
  return {
    type: 'TRIP_LIST_GET_REQUEST',
    payload: params,
  };
};

export const getTripListSuccess = (data) => {
  return {
    type: 'TRIP_LIST_GET_SUCCESS',
    payload: {
      items: data.content,
      pagination: data.pagination,
    },
  };
};

export const getTripListFailure = (error) => {
  return {
    type: 'TRIP_LIST_GET_FAILURE',
    payload: error,
  };
};
