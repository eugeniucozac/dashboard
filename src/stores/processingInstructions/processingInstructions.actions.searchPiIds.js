import * as utils from 'utils';
import { authLogout } from 'stores';

export const searchPiIds = (query) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}} = getState();

  const defaultError = {
    file: 'stores/processingInstructions.actions.searchPiIds',
  };

  dispatch(searchPiIdsRequest(query));

  if (!query) {
    dispatch(searchPiIdsFailure({ ...defaultError, message: 'Missing processing instruction id' }));
    return;
  }

  return utils.api
    .get({
      token: auth.accessToken,
      endpoint: endpoint.ppService,
      path: `instruction/refdata/instructionId/${query}`,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((data) => utils.api.handleNewData(data))
    .then((data) => {
      dispatch(searchPiIdsSuccess(data.data));
      return data.data;
    })
    .catch((err) => {
      utils.api.handleError(err, { ...defaultError, message: 'API fetch error (processingInstructions.searchPiIds)' });
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(searchPiIdsFailure(err));
      return err;
    });
};

export const searchPiIdsRequest = (query) => {
  return {
    type: 'PROCESSING_INSTRUCTIONS_SEARCH_PI_IDS_REQUEST',
    payload: query,
  };
};

export const searchPiIdsSuccess = (responseData) => {
  return {
    type: 'PROCESSING_INSTRUCTIONS_SEARCH_PI_IDS_SUCCESS',
    payload: responseData,
  };
};

export const searchPiIdsFailure = (error) => {
  return {
    type: 'PROCESSING_INSTRUCTIONS_SEARCH_PI_IDS_FAILURE',
    payload: error,
  };
};
