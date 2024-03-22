import { updatePiGridDataLoading, authLogout, updatePiHasNoGridData } from 'stores';
import * as utils from 'utils';
import get from 'lodash/get';

export const getProcessingInstructionsGridData =
  (params = {}) =>
  (dispatch, getState) => {
    // prettier-ignore
    const { user: { auth }, config: { vars: { endpoint }}, processingInstructions} = getState();
    const { page, size, sortBy, direction, query, filters = {} } = params;

    const defaultError = {
      file: 'stores/processingInstructions.actions.getProcessingInstructionsGridData',
    };

    const prevQuery = get(processingInstructions, 'gridData.query') || '';
    const newQuery = params.hasOwnProperty('query') ? query : prevQuery;

    const prevFilters = get(processingInstructions, 'gridData.filters') || {};
    const newFilters = params.hasOwnProperty('filters') ? filters : prevFilters;

    const filtersObject = Object.entries(newFilters).reduce((acc, [key, value]) => {
      const filterValues = value.map((v) => v.id).join('|');

      return filterValues
        ? {
            ...acc,
            [key]: encodeURIComponent(filterValues),
          }
        : acc;
    }, {});

    dispatch(getGridDataRequest(params));
    dispatch(updatePiGridDataLoading(true));

    const apiParams = {
      page: page || 1,
      pageSize: size || processingInstructions?.gridData?.pageSize,
      sortBy: sortBy || processingInstructions?.gridData?.sort?.by,
      direction: direction || processingInstructions?.gridData?.sort?.direction || '',
      ...(newQuery && { searchBy: newQuery }),
      ...filtersObject,
    };

    return utils.api
      .get({
        token: auth.accessToken,
        endpoint: endpoint.ppService,
        path: 'instructions',
        params: apiParams,
      })
      .then((response) => utils.api.handleResponse(response))
      .then((json) => utils.api.handleNewData(json))
      .then((data) => {
        dispatch(getGridDataSuccess(data, newFilters));
        return data;
      })
      .catch((err) => {
        utils.api.handleError(err, { ...defaultError, message: 'API fetch error (processingInstructions.post)' });
        dispatch(updatePiHasNoGridData(true));
        dispatch(getGridDataFailure(err));
        utils.api.handleUnauthorized(err, dispatch, authLogout);
        return err;
      })
      .finally(() => {
        dispatch(updatePiGridDataLoading(false));
      });
  };

export const getGridDataRequest = (params) => {
  return {
    type: 'PROCESSING_INSTRUCTIONS_GRID_DATA_GET_REQUEST',
    payload: params,
  };
};

export const getGridDataSuccess = (json, filters) => {
  return {
    type: 'PROCESSING_INSTRUCTIONS_GRID_DATA_GET_SUCCESS',
    payload: {
      items: json.data,
      pagination: json.pagination,
      filters: filters || {},
    },
  };
};

export const getGridDataFailure = (error) => {
  return {
    type: 'PROCESSING_INSTRUCTIONS_GRID_DATA_GET_FAILURE',
    payload: error,
  };
};
