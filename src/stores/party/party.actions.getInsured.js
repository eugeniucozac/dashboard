// app
import { authLogout } from 'stores';
import * as utils from 'utils';

export const getInsured =
  (id, reInsured = false) =>
  (dispatch, getState) => {
    // prettier-ignore
    const { user: { auth }, config: { vars: { endpoint }}} = getState();

    const defaultError = {
      file: 'stores/party.actions.getInsured',
    };

    dispatch(getInsuredRequest());

    if (!id) {
      dispatch(getInsuredFailure(defaultError));
      return;
    }

    const path = reInsured ? `api/v1/reinsured/${id}` : `api/v1/insured/${id}`;

    return utils.api
      .get({
        token: auth.accessToken,
        endpoint: endpoint.auth,
        path,
      })
      .then((response) => utils.api.handleResponse(response))
      .then((data) => {
        dispatch(getInsuredSuccess(data));
        return data;
      })
      .catch((err) => {
        utils.api.handleError(err, defaultError);
        utils.api.handleUnauthorized(err, dispatch, authLogout);
        dispatch(getInsuredFailure(err));
        return err;
      });
  };

export const getInsuredRequest = () => {
  return {
    type: 'INSURED_DETAIL_GET_REQUEST',
  };
};

export const getInsuredSuccess = (payload) => {
  return {
    type: 'INSURED_DETAIL_GET_SUCCESS',
    payload: payload,
  };
};

export const getInsuredFailure = (error) => {
  return {
    type: 'INSURED_DETAIL_GET_FAILURE',
    payload: error,
  };
};
