// app
import { authLogout, addLoader, removeLoader } from 'stores';
import * as utils from 'utils';

export const getOpeningMemoPlacementList =
  ({ origin, page, size, status }) =>
  (dispatch, getState) => {
    // prettier-ignore
    const { user: { auth }, config: { vars: { endpoint }}} = getState();

    const defaultError = {
      file: 'stores/openingMemo.actions.getPlacementList',
    };

    const openingMemo = getState().openingMemo;

    const endpointParams = {
      page: page || 1,
      size: size || openingMemo.list.pageSize,
      orderBy: openingMemo.list.sortBy,
      direction: openingMemo.list.sortDirection,
      status: status || openingMemo.list.status,
    };

    dispatch(getOpeningMemoPlacementListRequest({ origin, page, size }));
    dispatch(addLoader('getOpeningMemoPlacementList'));

    if (!utils.generic.isValidObject(origin) || !origin.path || !origin.id) {
      dispatch(getOpeningMemoPlacementListFailure(defaultError));
      dispatch(removeLoader('getOpeningMemoPlacementList'));
    }

    return utils.api
      .get({
        token: auth.accessToken,
        endpoint: endpoint.edge,
        path: `api/openingMemo/${origin.path}/${origin.id}`,
        params: endpointParams,
      })
      .then((response) => utils.api.handleResponse(response))
      .then((json) => utils.api.handleData(json))
      .then((data) => {
        dispatch(getOpeningMemoPlacementListSuccess(data));
      })
      .catch((err) => {
        utils.api.handleError(err, defaultError);
        utils.api.handleUnauthorized(err, dispatch, authLogout);
        dispatch(getOpeningMemoPlacementListFailure(err));
        return err;
      })
      .finally(() => {
        dispatch(removeLoader('getOpeningMemoPlacementList'));
      });
  };

export const getOpeningMemoPlacementListRequest = (payload) => {
  return {
    type: 'OPENING_MEMO_PLACEMENT_LIST_GET_REQUEST',
    payload,
  };
};

export const getOpeningMemoPlacementListSuccess = (data) => {
  return {
    type: 'OPENING_MEMO_PLACEMENT_LIST_GET_SUCCESS',
    payload: {
      content: data.content,
      pagination: data.pagination,
    },
  };
};

export const getOpeningMemoPlacementListFailure = (error) => {
  return {
    type: 'OPENING_MEMO_PLACEMENT_LIST_GET_FAILURE',
    payload: error,
  };
};
