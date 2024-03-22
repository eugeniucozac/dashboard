import get from 'lodash/get';
import { authLogout } from 'stores';
import * as utils from 'utils';

export const getReferenceDataByType =
  (type, searchTerm, limit = 200) =>
  (dispatch, getState) => {
    // prettier-ignore
    const { user: { auth }, config: { vars: { endpoint }}} = getState();

    dispatch(getReferenceDataByTypeRequest(type, searchTerm, limit));

    const endpointToStoreMap = {
      market: 'markets',
      client: 'clients',
      insured: 'insureds',
      'client/office': 'offices',
    };

    const data = {
      searchStr: searchTerm,
      limit,
    };

    return utils.api
      .post({
        token: auth.accessToken,
        endpoint: endpoint.edge,
        path: `api/${type}/search`,
        data,
      })
      .then((response) => utils.api.handleResponse(response))
      .then((json) => utils.api.handleData(json))
      .then((data) => {
        dispatch(getReferenceDataByTypeSuccess(type, data));
      })
      .then(() => {
        // last then to return updated state data to components waiting for this promise
        // ex: async Autocomplete (React-Select)
        return getState().referenceData[endpointToStoreMap[type]];
      })
      .catch((err) => {
        const errorParams = {
          file: 'stores/referenceData.actions.getByType',
          message: 'API fetch error (referenceData.getByType)',
        };

        utils.api.handleError(err, errorParams);
        utils.api.handleUnauthorized(err, dispatch, authLogout);
        dispatch(getReferenceDataByTypeFailure(err));
        return err;
      });
  };

export const getReferenceDataByTypeRequest = (...args) => {
  return {
    type: 'REFERENCE_DATA_GET_BY_TYPE_REQUEST',
    payload: args,
  };
};

export const getReferenceDataByTypeSuccess = (type, data) => {
  let actionType;

  switch (type) {
    case 'market':
      actionType = 'REFERENCE_DATA_GET_BY_TYPE_MARKETS_SUCCESS';
      break;
    case 'client':
      actionType = 'REFERENCE_DATA_GET_BY_TYPE_CLIENTS_SUCCESS';
      break;
    case 'insured':
      actionType = 'REFERENCE_DATA_GET_BY_TYPE_INSUREDS_SUCCESS';
      break;
    case 'client/office':
      actionType = 'REFERENCE_DATA_GET_BY_TYPE_OFFICES_SUCCESS';
      break;
    default:
      break;
  }

  if (!actionType) return;

  return {
    type: actionType,
    payload: get(data, 'content') || [],
  };
};

export const getReferenceDataByTypeFailure = (error) => {
  return {
    type: 'REFERENCE_DATA_TYPE_GET_FAILURE',
    payload: error,
  };
};
