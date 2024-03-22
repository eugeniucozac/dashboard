import * as utils from 'utils';
import { authLogout } from 'stores';

export const searchRiskIds = (query) => (dispatch, getState) => {
  // prettier-ignore
  // const { config: { vars: { endpoint }}} = getState();

  const defaultError = {
    file: 'stores/fileUpload.actions.searchRiskIds',
  };

  dispatch(searchRiskIdsRequest(query));

  if (!query) {
    dispatch(searchRiskIdsFailure({ ...defaultError, message: 'Missing risk reference search query' }));
    return;
  }

  return utils.api
    .get({
      // endpoint: endpoint.dmsService,
      endpoint: 'http://localhost:9000',
      path: `data/risk/reference/${query}`,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => {
      if (json && json.status === 'OK' && json.data) {
        // success
        dispatch(searchRiskIdsSuccess(json.data));
        return json.data;
      } else {
        // fail
        return Promise.reject({
          message: `API data format error${json.status ? ` (${json.status})` : ''}`,
          ...(json && { ...json }),
        });
      }
    })
    .catch((err) => {
      utils.api.handleError(err, { ...defaultError, message: 'API fetch error (fileUpload.searchRiskIds)' });
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(searchRiskIdsFailure(err));
      return err;
    });
};

export const searchRiskIdsRequest = (query) => {
  return {
    type: 'FILE_UPLOAD_SEARCH_RISK_IDS_REQUEST',
    payload: query,
  };
};

export const searchRiskIdsSuccess = (responseData) => {
  return {
    type: 'FILE_UPLOAD_SEARCH_RISK_IDS_SUCCESS',
    payload: responseData,
  };
};

export const searchRiskIdsFailure = (error) => {
  return {
    type: 'FILE_UPLOAD_SEARCH_RISK_IDS_FAILURE',
    payload: error,
  };
};
