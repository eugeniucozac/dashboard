import get from 'lodash/get';

import { addLoader, removeLoader, enqueueNotification, authLogout } from 'stores';
import * as utils from 'utils';
import * as constants from 'consts';

export const getComplexityBasisValue =
  (params, showLoader = true, type) =>
  (dispatch, getState) => {
    // prettier-ignore
    const { user: { auth }, config: { vars: { endpoint } }, claims } = getState();

    const defaultError = {
      file: 'stores/claims.actions.getComplexityBasisValue',
    };

    dispatch(getComplexityBasisValueRequest(params));

    if (showLoader) {
      dispatch(addLoader('getComplexityBasisValue'));
    }

    const prevDirection = get(claims, 'complexityBasisValues.sort.direction') || '';
    const newDirection = params?.hasOwnProperty('direction') ? params.direction : prevDirection;

    const prevQuery = get(claims, 'complexityBasisValues.query') || '';
    const newQuery = params?.hasOwnProperty('term') ? params.term : prevQuery;

    const prevSortBy = get(claims, 'complexityBasisValues.sort.by') || '';
    const newSortBy = params?.hasOwnProperty('sortBy') ? params.sortBy : prevSortBy;

    const data = {
      direction: newDirection,
      page: (params && params.page) || 0,
      pageSize: (params && params.size) || claims.complexityBasisValues.pageSize,
      search: newQuery,
      sortBy: newSortBy,
    };

    return utils.api
      .post({
        token: auth.accessToken,
        endpoint: endpoint.claimService,
        path: 'api/data/claims-triage/complex/complexity-values/search',
        data,
      })
      .then((response) => utils.api.handleResponse(response))
      .then((json) => utils.api.handleNewData(json))
      .then((data) => {
        dispatch(getComplexityBasisValueSuccess(data, type));
        return data;
      })
      .catch((err) => {
        utils.api.handleError(err, { ...defaultError, message: 'API fetch error (claims.getComplexityBasisValues)' });
        utils.api.handleUnauthorized(err, dispatch, authLogout);
        dispatch(getComplexityBasisValueFailure(err));
        dispatch(
          err?.response?.status === constants.API_STATUS_NOT_FOUND
            ? enqueueNotification('notification.getComplexityBasisValues.notFound', 'error')
            : enqueueNotification('notification.getComplexityBasisValues.fail', 'error')
        );
        return err;
      })
      .finally(() => {
        if (showLoader) {
          dispatch(removeLoader('getComplexityBasisValue'));
        }
      });
  };

export const getComplexityBasisValueRequest = (params) => {
  return {
    type: 'CLAIMS_COMPLEXITY_BASIS_VALUE_GET_REQUEST',
    payload: params,
  };
};

export const getComplexityBasisValueSuccess = (data, type) => {
  return {
    type: 'CLAIMS_COMPLEXITY_BASIS_VALUE_GET_SUCCESS',
    payload: { ...data, type },
  };
};

export const getComplexityBasisValueFailure = (err) => {
  return {
    type: 'CLAIMS_COMPLEXITY_BASIS_VALUE_GET_FAILURE',
    payload: err,
  };
};
