import get from 'lodash/get';

// app
import { authLogout, resetRiskSelected } from 'stores';
import * as utils from 'utils';

export const getDraftList = (params) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}} = getState();

  const defaultError = {
    file: 'stores/risk.actions.getDraftList',
  };

  const state = getState();
  const prevQuery = get(state, 'risk.draftlist.query') || '';
  const isNewQuery = params && params.hasOwnProperty('query');
  const newQuery = isNewQuery ? params.query : prevQuery;

  const paramsSize = (params && params.size) || get(state, 'risk.draftList.pageSize');
  const paramsOrderBy = (params && params.orderBy) || get(state, 'risk.draftList.sortBy');
  const paramsDirection = (params && params.direction) || get(state, 'risk.draftList.sortDirection');

  const endpointParams = {
    page: (params && params.page) || 1,
    ...(paramsSize && { size: paramsSize }),
    ...(paramsOrderBy && { orderBy: paramsOrderBy }),
    ...(paramsDirection && { direction: paramsDirection }),
    ...(newQuery && { query: newQuery }),
  };

  dispatch(getDraftListRequest(endpointParams));

  return utils.api
    .get({
      token: auth.accessToken,
      endpoint: endpoint.auth,
      path: 'api/v1/risks/drafts',
      params: endpointParams,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleResponseJsonObject(json, 'content'))
    .then((data) => {
      dispatch(getDraftListSuccess(data));
      dispatch(resetRiskSelected());
    })
    .catch((err) => {
      utils.api.handleError(err, defaultError);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(getDraftListFailure(err));
      return err;
    });
};

export const getDraftListRequest = (params) => {
  return {
    type: 'DRAFT_LIST_GET_REQUEST',
    payload: params,
  };
};

export const getDraftListSuccess = (data) => {
  return {
    type: 'DRAFT_LIST_GET_SUCCESS',
    payload: {
      content: data.content,
      pagination: data.pagination,
    },
  };
};

export const getDraftListFailure = (error) => {
  return {
    type: 'DRAFT_LIST_GET_FAILURE',
    payload: error,
  };
};
