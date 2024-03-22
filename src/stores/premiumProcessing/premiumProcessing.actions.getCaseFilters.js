import * as utils from 'utils';
import { authLogout, addLoader, removeLoader } from 'stores';

export const getCaseFilters = (params) => (dispatch, getState) => {
  const {
    user: { auth },
    config: {
      vars: { endpoint },
    },
  } = getState();

  dispatch(getCaseFiltersRequest());
  dispatch(addLoader('getCaseFilters'));

  return utils.api
    .get({
      token: auth.accessToken,
      endpoint: endpoint.odsService,
      path: `referenceData/${params.filters}`,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleNewData(json))
    .then((data) => {
      if (data && data?.status === 'OK' && data?.data) {
        dispatch(getCaseFiltersSuccess(data?.data));
      }
    })
    .catch((err) => {
      const errorParams = {
        file: 'stores/premiumProcessing.actions.getCaseFilters',
        message: 'API fetch error (premiumProcessing.actions.getCaseFilters)',
      };

      utils.api.handleError(err, errorParams);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(getCaseFiltersFailure(err));
      return err;
    })
    .finally(() => {
      dispatch(removeLoader('getCaseFilters'));
    });
};

export const getCaseFiltersRequest = () => {
  return {
    type: 'PREMIUM_PROCESSING_CASE_FILTERS_REQUEST',
  };
};

export const getCaseFiltersSuccess = (data) => {
  return {
    type: 'PREMIUM_PROCESSING_CASE_FILTERS_SUCCESS',
    payload: data,
  };
};

export const getCaseFiltersFailure = (error) => {
  return {
    type: 'PREMIUM_PROCESSING_CASE_FILTERS_FAILURE',
    payload: error,
  };
};
