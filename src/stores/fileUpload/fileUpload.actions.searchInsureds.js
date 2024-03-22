import * as utils from 'utils';
import { authLogout } from 'stores';

export const searchInsureds = (query) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}} = getState();

  const defaultError = {
    file: 'stores/fileUpload.actions.searchInsureds',
  };

  dispatch(searchInsuredsRequest(query));

  if (!query) {
    dispatch(searchInsuredsFailure({ ...defaultError, message: 'Missing insured search query' }));
    return;
  }

  return utils.api
    .post({
      token: auth.accessToken,
      endpoint: endpoint.edge,
      path: 'api/insured/search',
      data: {
        searchStr: query,
        limit: 200,
      },
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleData(json))
    .then((data) => {
      const { content } = data;
      dispatch(searchInsuredsSuccess(data));
      return content;
    })
    .catch((err) => {
      utils.api.handleError(err, { ...defaultError, message: 'API fetch error (fileUpload.searchInsureds)' });
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(searchInsuredsFailure(err));
      return err;
    });
};

export const searchInsuredsRequest = (query) => {
  return {
    type: 'FILE_UPLOAD_SEARCH_INSUREDS_REQUEST',
    payload: query,
  };
};

export const searchInsuredsSuccess = (responseData) => {
  return {
    type: 'FILE_UPLOAD_SEARCH_INSUREDS_SUCCESS',
    payload: responseData,
  };
};

export const searchInsuredsFailure = (error) => {
  return {
    type: 'FILE_UPLOAD_SEARCH_INSUREDS_FAILURE',
    payload: error,
  };
};
