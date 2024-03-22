import * as utils from 'utils';
import { authLogout, enqueueNotification } from 'stores';

export const searchRiskRefIds = (query) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}} = getState();

  const defaultError = {
    file: 'stores/processingInstructions.actions.getRiskRefIds',
  };

  dispatch(searchRiskRefIdsRequest(query));

  if (!query) {
    dispatch(searchRiskRefIdsFailure({ ...defaultError, message: 'Missing risk reference id search query' }));
    return;
  }

  return utils.api
    .get({
      token: auth.accessToken,
      endpoint: endpoint.ppService,
      path: `risk/reference/dropdownSearch/${query}`,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => {
      if (json && json.status === 'OK' && json.data) {
        if (json.data.length === 0) {
          dispatch(enqueueNotification(utils.string.t('processingInstructions.noRiskRefInDepartAndInstance', { query: query }), 'warning'));
          return;
        }
        // success
        dispatch(searchRiskRefIdsSuccess(json.data));
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
      utils.api.handleError(err, { ...defaultError, message: 'API fetch error (processingInstructions.searchRiskRefIds)' });
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(searchRiskRefIdsFailure(err));
      return err;
    });
};

export const searchRiskRefIdsRequest = (query) => {
  return {
    type: 'PROCESSING_INSTRUCTIONS_SEARCH_RISK_IDS_REQUEST',
    payload: query,
  };
};

export const searchRiskRefIdsSuccess = (responseData) => {
  return {
    type: 'PROCESSING_INSTRUCTIONS_SEARCH_RISK_IDS_SUCCESS',
    payload: responseData,
  };
};

export const searchRiskRefIdsFailure = (error) => {
  return {
    type: 'PROCESSING_INSTRUCTIONS_SEARCH_RISK_IDS_FAILURE',
    payload: error,
  };
};
