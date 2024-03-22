import * as utils from 'utils';

//app
import { authLogout, addLoader, removeLoader } from 'stores';

export const getAdvancedSearchResults =
  (params = {}, selectedProcess) =>
  (dispatch, getState) => {
    // prettier-ignore
    const { user: { auth }, config: { vars: { endpoint }}} = getState();
    const { insuredName, depart, yoa } = params;
    const yearOfAcc = yoa ? yoa : 0;

    const defaultError = {
      file: 'stores/processingInstructions.actions.getAdvancedSearchResults',
    };

    dispatch(getAdvancedSearchResultsRequest(params));
    dispatch(addLoader('getAdvancedSearchResults'));
    const httpParams = {
      insuredName: encodeURIComponent(insuredName?.name),
      year: yearOfAcc,
      processType: selectedProcess?.split(' ').join(''),
      ...(depart?.name && { departmentName: encodeURIComponent(depart.name) }),
    };

    return utils.api
      .get({
        token: auth.accessToken,
        endpoint: endpoint.ppService,
        path: 'data/advance/search/risk/reference',
        params: httpParams,
      })
      .then((response) => utils.api.handleResponse(response))
      .then((json) => {
        if (json && json.status === 'OK' && json.data) {
          // success
          dispatch(getAdvancedSearchResultsSuccess(json.data));
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
        utils.api.handleError(err, { ...defaultError, message: 'API fetch error (processingInstructions.getAdvancedSearchResults)' });
        utils.api.handleUnauthorized(err, dispatch, authLogout);
        dispatch(getAdvancedSearchResultsFailure(err));
        return err.json.data;
      })
      .finally(() => {
        dispatch(removeLoader('getAdvancedSearchResults'));
      });
  };

export const getAdvancedSearchResultsRequest = (payload) => {
  return {
    type: 'PROCESSING_INSTRUCTIONS_GET_ADVANCED_SEARCH_RESULTS_REQUEST',
    payload,
  };
};

export const getAdvancedSearchResultsSuccess = (responseData) => {
  return {
    type: 'PROCESSING_INSTRUCTIONS_GET_ADVANCED_SEARCH_RESULTS_SUCCESS',
    payload: responseData,
  };
};

export const getAdvancedSearchResultsFailure = (error) => {
  return {
    type: 'PROCESSING_INSTRUCTIONS_GET_ADVANCED_SEARCH_RESULTS_FAILURE',
    payload: error,
  };
};
