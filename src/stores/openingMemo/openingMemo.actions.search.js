// app
import { authLogout } from 'stores';
import * as utils from 'utils';

export const searchOpeningMemoList =
  ({ type, query, origin }) =>
  (dispatch, getState) => {
    // prettier-ignore
    const { user: { auth }, config: { vars: { endpoint }}} = getState();

    const defaultError = {
      file: 'stores/openingMemo.actions.search',
    };

    dispatch(searchOpeningMemoListRequest({ type, query, origin }));

    if (!utils.generic.isValidObject(origin) || !origin.path || !origin.id) {
      dispatch(searchOpeningMemoListFailure(defaultError));
    }

    const endpointParams = {
      query: encodeURIComponent(query),
      orderBy: type,
      direction: 'desc',
    };

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
        dispatch(searchOpeningMemoListSuccess(data));
        return data;
      })
      .then((data) => {
        // required for autosearch async handler
        return data.content;
      })
      .catch((err) => {
        utils.api.handleError(err, defaultError);
        utils.api.handleUnauthorized(err, dispatch, authLogout);
        dispatch(searchOpeningMemoListFailure(err));
        return err;
      });
  };

export const searchOpeningMemoListRequest = (payload) => {
  return {
    type: 'OPENING_MEMO_LIST_SEARCH_REQUEST',
    payload,
  };
};

export const searchOpeningMemoListSuccess = (data) => {
  return {
    type: 'OPENING_MEMO_LIST_SEARCH_SUCCESS',
    payload: {
      content: data.content,
      pagination: data.pagination,
    },
  };
};

export const searchOpeningMemoListFailure = (error) => {
  return {
    type: 'OPENING_MEMO_LIST_SEARCH_FAILURE',
    payload: error,
  };
};
