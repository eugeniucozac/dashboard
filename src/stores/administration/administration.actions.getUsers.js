import * as utils from 'utils';
import { addLoader, removeLoader, authLogout } from 'stores';
import config from 'config';
import get from 'lodash/get';

export const getUsers =
  (params = {}) =>
  (dispatch, getState) => {
    // prettier-ignore
    const { user: { auth }, config: { vars: { endpoint } }, administration: { userList } } = getState();
    const { page, size, sortBy, direction, searchBy, filters = {} } = params;

    const defaultError = {
      file: 'stores/administration.actions.getUsers',
    };

    const prevQuery = get(userList, 'query') || '';
    const newQuery = params.hasOwnProperty('searchBy') ? searchBy : prevQuery;

    const prevFilters = get(userList, 'filters') || {};
    const newFilters = params.hasOwnProperty('filters') ? filters : prevFilters;

    const filtersObject = Object.entries(newFilters).reduce((acc, [key, value]) => {
      const filterValues = value.map((v) => v.id).join(',');

      return filterValues
        ? {
            ...acc,
            [key]: filterValues,
          }
        : acc;
    }, {});

    const businessProcessId = params.hasOwnProperty('businessProcessIds') ? { businessProcessIds: params.businessProcessIds } : null;

    const apiParams = {
      page: page || 1,
      pageSize: size || userList?.pageSize,
      sortBy: sortBy || userList?.sortBy,
      direction: direction || userList?.sortDirection || '',
      ...(newQuery && { searchBy: newQuery }),
      ...filtersObject,
      ...businessProcessId,
    };

    dispatch(getUsersRequest(params));
    dispatch(addLoader('getUsers'));

    return utils.api
      .get({
        token: auth.accessToken,
        endpoint: endpoint.authService,
        path: 'api/users',
        params: apiParams,
      })
      .then((response) => utils.api.handleResponse(response))
      .then((json) => utils.api.handleNewData(json))
      .then((json) => {
        dispatch(getUsersSuccess(json, newFilters));
      })
      .catch((err) => {
        utils.api.handleError(err, defaultError);
        utils.api.handleUnauthorized(err, dispatch, authLogout);
        dispatch(getUsersFailure(err));
        return err;
      })
      .finally(() => {
        dispatch(removeLoader('getUsers'));
      });
  };

export const getUsersRequest = (params) => {
  return {
    type: 'ADMINISTRATION_USERS_GET_REQUEST',
    payload: params,
  };
};

export const getUsersSuccess = (json, filters) => {
  return {
    type: 'ADMINISTRATION_USERS_GET_SUCCESS',
    payload: {
      content: json?.data,
      pagination: {
        itemsTotal: json?.pagination?.totalElements || 0,
        page: json?.pagination?.page || 1,
        pageSize: json?.pagination?.size || config.ui.pagination.default,
        pageTotal: json?.pagination?.totalPages || 0,
        query: json?.pagination?.searchBy || '',
      },
      sort: {
        sortBy: json?.pagination?.orderBy,
        sortDirection: json?.pagination?.direction || '',
      },
      filters: filters || {},
    },
  };
};

export const getUsersFailure = (data) => {
  return {
    type: 'ADMINISTRATION_USERS_GET_FAILURE',
    payload: data,
  };
};

export const resetUsers = () => {
  return {
    type: 'ADMINISTRATION_RESET_USERS',
  };
};
