import get from 'lodash/get';

// app
import * as utils from 'utils';
import { authLogout } from 'stores';

export const getLocationSummary =
  ({ level, placementIds, levelOverride }) =>
  (dispatch, getState) => {
    // prettier-ignore
    const { user: { auth }, config: { vars: { endpoint }}, portfolioMap } = getState();

    const newLevel = levelOverride || level || get(portfolioMap, 'tiv.levelOverride') || get(portfolioMap, 'tiv.level');

    const defaultError = {
      file: 'stores/portfolioMap.actions.get',
    };

    dispatch(getLocationSummaryRequest({ level, placementIds, levelOverride }));

    if (!placementIds || !utils.generic.isValidArray(placementIds, true) || !newLevel) {
      dispatch(getLocationSummaryFailure(defaultError));
      return;
    }

    const endpointParams = {
      level: newLevel,
      placementIds,
    };

    return utils.api
      .get({
        token: auth.accessToken,
        endpoint: endpoint.location,
        path: `api/summary`,
        params: endpointParams,
      })
      .then((response) => utils.api.handleResponse(response))
      .then((json) => utils.api.handleData(json))
      .then((data) => {
        dispatch(
          getLocationSummarySuccess({
            level: level || get(portfolioMap, 'tiv.level'),
            levelOverride: levelOverride || get(portfolioMap, 'tiv.levelOverride'),
            placementIds,
            data,
          })
        );
      })
      .catch((err) => {
        const errorParams = {
          file: 'stores/portfolioMap.actions.get',
          message: 'API fetch error (portfolioMap.get)',
        };

        utils.api.handleError(err, errorParams);
        utils.api.handleUnauthorized(err, dispatch, authLogout);
        dispatch(getLocationSummaryFailure(err));
        return err;
      });
  };

export const getLocationSummaryRequest = (payload) => {
  return {
    type: 'PORTFOLIO_MAP_GET_REQUEST',
    payload,
  };
};

export const getLocationSummarySuccess = (payload) => {
  return {
    type: 'PORTFOLIO_MAP_GET_SUCCESS',
    payload,
  };
};

export const getLocationSummaryFailure = (error) => {
  return {
    type: 'PORTFOLIO_MAP_GET_FAILURE',
    payload: error,
  };
};
