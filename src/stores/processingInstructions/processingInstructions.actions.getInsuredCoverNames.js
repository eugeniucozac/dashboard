import * as utils from 'utils';
import { authLogout } from 'stores';

export const searchInsuredCoverHolderNames = (query) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}} = getState();

  const defaultError = {
    file: 'stores/processingInstructions.actions.getInsuredCoverNames',
  };

  dispatch(searchInsuredCoverHolderNamesRequest(query));

  if (!query) {
    dispatch(searchInsuredCoverHolderNamesFailure({ ...defaultError, message: 'Missing insured or cover holder name search query' }));
    return;
  }

  return utils.api
    .get({
      token: auth.accessToken,
      endpoint: endpoint.ppService,
      path: `insured/search/${query}`,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => {
      if (json && json.status === 'OK' && json.data) {
        // success
        const insuredNames = json.data.map((insured) => ({ id: insured.insuredId, name: insured.insuredName }));
        dispatch(searchInsuredCoverHolderNamesSuccess(insuredNames));
        return insuredNames;
      } else {
        // fail
        return Promise.reject({
          message: `API data format error${json.status ? ` (${json.status})` : ''}`,
          ...(json && { ...json }),
        });
      }
    })
    .catch((err) => {
      utils.api.handleError(err, { ...defaultError, message: 'API fetch error (processingInstructions.searchInsuredCoverNames)' });
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(searchInsuredCoverHolderNamesFailure(err));
      return err;
    });
};

export const searchInsuredCoverHolderNamesRequest = (query) => {
  return {
    type: 'PROCESSING_INSTRUCTIONS_SEARCH_INSURED_NAMES_REQUEST',
    payload: query,
  };
};

export const searchInsuredCoverHolderNamesSuccess = (responseData) => {
  return {
    type: 'PROCESSING_INSTRUCTIONS_SEARCH_INSURED_NAMES_SUCCESS',
    payload: responseData,
  };
};

export const searchInsuredCoverHolderNamesFailure = (error) => {
  return {
    type: 'PROCESSING_INSTRUCTIONS_SEARCH_INSURED_NAMES_FAILURE',
    payload: error,
  };
};
