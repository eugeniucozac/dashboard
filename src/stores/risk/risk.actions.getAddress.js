import * as utils from 'utils';
import { authLogout } from 'stores';

export const getRiskAddress = (searchTerm) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}} = getState();

  dispatch(getRiskAddressRequest(searchTerm));

  const body = {
    address: searchTerm,
  };

  return utils.api
    .post({
      token: auth.accessToken,
      endpoint: endpoint.location,
      path: 'api/search',
      data: body,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleData(json))
    .then((data) => {
      dispatch(getRiskAddressSuccess(data));
      return data;
    })
    .catch((err) => {
      const errorParams = {
        file: 'stores/risk.actions.getRiskAddress',
        message: 'API fetch error (risk.getRiskAddress)',
      };

      utils.api.handleError(err, errorParams);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(getRiskAddressFailure(err));
      return err;
    });
};

export const getRiskAddressRequest = (searchTerm) => {
  return {
    type: 'RISK_ADDRESS_GET_REQUEST',
    payload: searchTerm,
  };
};

export const getRiskAddressSuccess = (responseData) => {
  return {
    type: 'RISK_ADDRESS_GET_SUCCESS',
    payload: responseData,
  };
};

export const getRiskAddressFailure = (error) => {
  return {
    type: 'RISK_ADDRESS_GET_FAILURE',
    payload: error,
  };
};
