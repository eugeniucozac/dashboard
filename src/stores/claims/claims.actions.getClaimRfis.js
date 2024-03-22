import get from 'lodash/get';

// app
import { authLogout, addLoader, removeLoader, enqueueNotification } from 'stores';
import * as utils from 'utils';

export const getClaimRfis = (params) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}, claims} = getState();
  const { claimID, page, size, sortBy, direction, query, filters = {} } = params;

  const defaultError = {
    file: 'stores/claims.actions.getClaimRfis',
  };

  dispatch(getClaimRfisRequest(params));
  dispatch(addLoader('getClaimRfis'));

  if (!claimID) {
    dispatch(getClaimRfisFailure({ ...defaultError, message: 'Missing claimID param' }));
    dispatch(enqueueNotification('claims.rfis.notifications.getFailure', 'error'));
    dispatch(removeLoader('getClaimRfis'));
    return;
  }

  const prevDirection = get(claims, 'rfis.sort.direction') || '';
  const newDirection = params.hasOwnProperty('direction') ? direction : prevDirection;

  const prevQuery = get(claims, 'rfis.query') || '';
  const newQuery = params.hasOwnProperty('query') ? query : prevQuery;

  const constructFilters = (filtersObj) => {
    const filteredArray = [];
    for (const key in filtersObj) {
      if (filtersObj[key]?.length > 0 && typeof filtersObj[key] !== 'string') {
        filteredArray.push({
          column: key,
          filterValue: filtersObj[key],
        });
      } else if (typeof filtersObj[key] === 'string' && filtersObj[key] !== '') {
        filteredArray.push({
          column: key,
          filterValue: [{ id: 0, name: filtersObj[key] }],
        });
      }
    }
    return filteredArray;
  };

  const prevFilters = get(claims, 'rfis.filters') || [];
  const newFilters = params.hasOwnProperty('filters') ? constructFilters(filters) : prevFilters;

  const apiParams = {
    page: page || 0,
    pageSize: size || claims?.rfis?.pageSize,
    sortBy: sortBy || claims?.rfis?.sort?.by,
    direction: newDirection,
    search: newQuery || '',
    filters: newFilters?.length > 0 ? newFilters : null,
  };

  return utils.api
    .post({
      token: auth.accessToken,
      endpoint: endpoint.bpmService,
      path: `rfi/${claimID}/search`,
      data: apiParams,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((data) => utils.api.handleNewData(data))
    .then((json) => {
      dispatch(getClaimRfisSuccess(json));
      return json;
    })
    .catch((err) => {
      dispatch(getClaimRfisFailure(err, defaultError));
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      return err;
    })
    .finally(() => {
      dispatch(removeLoader('getClaimRfis'));
    });
};

export const getClaimRfisRequest = (params) => {
  return {
    type: 'CLAIM_RFIS_GET_REQUEST',
    payload: params,
  };
};

export const getClaimRfisSuccess = (data) => {
  return {
    type: 'CLAIM_RFIS_GET_SUCCESS',
    payload: {
      items: data.data?.searchValue,
      filters: data.data?.filterValue,
      pagination: data.pagination,
    },
  };
};

export const getClaimRfisFailure = (err) => {
  return {
    type: 'CLAIM_RFIS_GET_FAILURE',
    payload: err,
  };
};
