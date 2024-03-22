import { authLogout, updateRiskListItemsStatus } from 'stores';
import * as utils from 'utils';

export const getRiskDetails =
  (id, refresh, showLoading = true) =>
  (dispatch, getState) => {
    // prettier-ignore
    const { user: { auth }, config: { vars: { endpoint }}} = getState();

    const defaultError = {
      file: 'stores/risk.actions.getDetails',
    };

    showLoading && dispatch(getRiskDetailsRequest(id));

    if (!id) {
      dispatch(getRiskDetailsFailure({ ...defaultError, message: 'ID missing' }));
      return { ...defaultError, message: 'ID missing' };
    }
    const path = refresh ? `api/v1/risks/${id}/refresh` : `api/v1/risks/${id}`;

    return utils.api
      .get({
        token: auth.accessToken,
        endpoint: endpoint.auth,
        path,
      })
      .then((response) => utils.api.handleResponse(response))
      .then((json) => utils.api.handleResponseJsonObject(json))
      .then((data) => {
        refresh ? dispatch(getRiskDetailsRefreshSuccess(data)) : dispatch(getRiskDetailsSuccess(data));
        return data;
      })
      .then(({ id, riskStatus }) => {
        dispatch(updateRiskListItemsStatus(id, riskStatus));
      })
      .catch((err) => {
        utils.api.handleError(err, defaultError);
        utils.api.handleUnauthorized(err, dispatch, authLogout);
        dispatch(getRiskDetailsFailure(err));
        return err;
      });
  };

export const getRiskDetailsRequest = (id) => {
  return {
    type: 'RISK_DETAILS_GET_REQUEST',
    payload: id,
  };
};

export const getRiskDetailsSuccess = (data) => {
  return {
    type: 'RISK_DETAILS_GET_SUCCESS',
    payload: data,
  };
};

export const getRiskDetailsRefreshSuccess = (data) => {
  return {
    type: 'RISK_DETAILS_REFRESH_GET_SUCCESS',
    payload: data,
  };
};

export const getRiskDetailsFailure = (error) => {
  return {
    type: 'RISK_DETAILS_GET_FAILURE',
    payload: error,
  };
};
