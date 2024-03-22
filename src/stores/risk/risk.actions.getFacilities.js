import get from 'lodash/get';

// app
import { authLogout } from 'stores';
import * as utils from 'utils';

export const getRiskFacilities = (params) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}} = getState();

  const defaultError = {
    file: 'stores/risk.actions.getFacilities',
  };

  const state = getState();
  const paramsSize = (params && params.size) || get(state, 'risk.facilities.list.pageSize');
  const paramsOrderBy = (params && params.orderBy) || get(state, 'risk.facilities.list.sortBy');
  const paramsDirection = (params && params.direction) || get(state, 'risk.facilities.list.sortDirection');

  const endpointParams = {
    page: (params && params.page) || 1,
    ...(paramsSize && { size: paramsSize }),
    ...(paramsOrderBy && { orderBy: paramsOrderBy }),
    ...(paramsDirection && { direction: paramsDirection }),
  };

  dispatch(getFacilitiesRequest(endpointParams));

  const path = params?.id ? `api/v1/facilities/risk/${params.id}` : `api/v1/facilities`;

  return utils.api
    .get({
      token: auth.accessToken,
      endpoint: endpoint.auth,
      path,
      params: endpointParams,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((data) => {
      dispatch(getFacilitiesSuccess(data));
    })
    .catch((err) => {
      utils.api.handleError(err, defaultError);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(getFacilitiesFailure(err));
      return err;
    });
};

export const getFacilitiesRequest = (payload) => {
  return {
    type: 'RISK_FACILITIES_GET_REQUEST',
    payload,
  };
};

export const getFacilitiesSuccess = (payload) => {
  return {
    type: 'RISK_FACILITIES_GET_SUCCESS',
    payload: {
      content: payload?.content ? payload.content : payload,
      pagination: payload?.pagination,
    },
  };
};

export const getFacilitiesFailure = (error) => {
  return {
    type: 'RISK_FACILITIES_GET_FAILURE',
    payload: error,
  };
};
