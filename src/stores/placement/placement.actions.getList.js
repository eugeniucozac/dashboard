import get from 'lodash/get';

// app
import { addLoader, authLogout, getPlacementDetails, removeLoader } from 'stores';
import * as utils from 'utils';

export const getPlacementList = (params) => (dispatch, getState) => {
  // prettier-ignore
  const { user, config: { vars: { endpoint }}} = getState();
  const { auth } = user;

  const defaultError = {
    file: 'stores/placement.actions.getList',
  };

  const placement = getState().placement;
  const userDept = (params && params.dept) || utils.user.department.getCurrent(user);

  const prevQuery = get(placement, 'list.query') || '';
  const isNewQuery = params && params.hasOwnProperty('query');
  const newQuery = isNewQuery ? params.query : prevQuery;

  const prevDirection = get(placement, 'sort.direction') || '';
  const isNewDirection = params && params.hasOwnProperty('direction');
  const newDirection = isNewDirection && params.direction;

  const endpointParams = {
    page: (params && params.page) || 1,
    size: (params && params.size) || placement.list.pageSize,
    orderBy: (params && params.orderBy) || placement.sort.by,
    direction: isNewDirection ? newDirection : isNewQuery && newQuery ? 'desc' : isNewQuery && !newQuery ? 'asc' : prevDirection,
    ...(newQuery && { query: newQuery }),
  };

  dispatch(getPlacementListRequest(endpointParams));
  dispatch(addLoader('getPlacementList'));

  if (!userDept) {
    dispatch(getPlacementListFailure(defaultError));
    dispatch(removeLoader('getPlacementList'));
  }

  return utils.api
    .get({
      token: auth.accessToken,
      endpoint: endpoint.edge,
      path: `api/placement/department/${userDept}`,
      params: endpointParams,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleData(json))
    .then((data) => {
      dispatch(getPlacementListSuccess(data));
      dispatch(getPlacementDetails(get(data, 'content[0].id')));
      dispatch(removeLoader('getPlacementList'));
      return data;
    })
    .catch((err) => {
      utils.api.handleError(err, defaultError);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(getPlacementListFailure(err));
      dispatch(removeLoader('getPlacementList'));
      return err;
    });
};

export const getPlacementListRequest = (params) => {
  return {
    type: 'PLACEMENT_LIST_GET_REQUEST',
    payload: params,
  };
};

export const getPlacementListSuccess = (data) => {
  return {
    type: 'PLACEMENT_LIST_GET_SUCCESS',
    payload: {
      items: data.content,
      pagination: data.pagination,
    },
  };
};

export const getPlacementListFailure = (error) => {
  return {
    type: 'PLACEMENT_LIST_GET_FAILURE',
    payload: error,
  };
};
