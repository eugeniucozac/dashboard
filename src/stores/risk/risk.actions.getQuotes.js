import { authLogout } from 'stores';
import * as utils from 'utils';

export const getRiskQuotes =
  (id, updateLoading = true) =>
  (dispatch, getState) => {
    // prettier-ignore
    const { user: { auth }, config: { vars: { endpoint }}} = getState();

    const defaultError = {
      file: 'stores/risk.actions.getQuotes',
    };

    updateLoading && dispatch(getRiskQuotesRequest(id));

    if (!id) {
      dispatch(getRiskQuotesFailure(defaultError));
      return;
    }

    return utils.api
      .get({
        token: auth.accessToken,
        endpoint: endpoint.auth,
        path: `api/v1/risks/${id}/quotes`,
      })
      .then((response) => utils.api.handleResponse(response))
      .then((json) => utils.api.handleResponseJsonArray(json))
      .then((data) => {
        dispatch(getRiskQuotesSuccess(data, id));
        return data;
      })
      .catch((err) => {
        utils.api.handleError(err, defaultError);
        utils.api.handleUnauthorized(err, dispatch, authLogout);
        dispatch(getRiskQuotesFailure(err));
        return err;
      });
  };

export const getRiskQuotesRequest = (id) => {
  return {
    type: 'RISK_QUOTES_GET_REQUEST',
    payload: id,
  };
};

export const getRiskQuotesSuccess = (data, riskId) => {
  return {
    type: 'RISK_QUOTES_GET_SUCCESS',
    payload: { items: data, riskId },
  };
};

export const getRiskQuotesFailure = (error) => {
  return {
    type: 'RISK_QUOTES_GET_FAILURE',
    payload: error,
  };
};
