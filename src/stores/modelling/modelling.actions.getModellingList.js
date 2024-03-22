// app
import { authLogout, addLoader, removeLoader } from 'stores';
import * as utils from 'utils';

export const getModellingList = (placementId, params) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}} = getState();

  const defaultError = {
    file: 'stores/modelling.actions.getModellingList',
  };

  const modelling = getState().modelling;

  const endpointParams = {
    page: (params && params.page) || 1,
    size: (params && params.size) || modelling.list.pageSize,
    orderBy: modelling.list.sortBy,
    direction: modelling.list.sortDirection,
  };

  dispatch(getModellingListRequest(placementId));
  dispatch(addLoader('getModellingList'));

  const placementRoute = placementId ? `placement/${placementId}` : '';

  return utils.api
    .get({
      token: auth.accessToken,
      endpoint: endpoint.edge,
      path: `api/modelling/${placementRoute}`,
      params: endpointParams,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleData(json))
    .then((data) => {
      dispatch(getModellingListSuccess(data));
    })
    .catch((err) => {
      utils.api.handleError(err, defaultError);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(getModellingListFailure(err));
      return err;
    })
    .finally(() => {
      dispatch(removeLoader('getModellingList'));
    });
};

export const getModellingListRequest = (payload) => {
  return {
    type: 'MODELLING_LIST_GET_REQUEST',
    payload,
  };
};

export const getModellingListSuccess = (data) => {
  return {
    type: 'MODELLING_LIST_GET_SUCCESS',
    payload: {
      content: data.content,
      pagination: data.pagination,
    },
  };
};

export const getModellingListFailure = (error) => {
  return {
    type: 'MODELLING_LIST_GET_FAILURE',
    payload: error,
  };
};
