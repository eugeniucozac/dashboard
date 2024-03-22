import * as utils from 'utils';
import { authLogout, addLoader, removeLoader } from 'stores';

export const getPolicy =
  (umrIds, savePolicy = true) =>
  (dispatch, getState) => {
    // prettier-ignore
    const { user: { auth }, config: { vars: { endpoint }}} = getState();

    const defaultError = {
      file: 'stores/policy.actions.get',
    };

    dispatch(getPolicyRequest(umrIds, savePolicy));
    dispatch(addLoader('getPolicy'));

    if (!umrIds) {
      dispatch(getPolicyFailure({ ...defaultError, message: 'Missing policy ID' }));
      dispatch(removeLoader('getPolicy'));
      return;
    }

    return utils.api
      .get({
        token: auth.accessToken,
        endpoint: endpoint.edge,
        path: `api/policy/xb/${umrIds}`,
      })
      .then((response) => utils.api.handleResponse(response))
      .then((json) => utils.api.handleData(json))
      .then((data) => {
        dispatch(getPolicySuccess(savePolicy ? data : null));
        return data;
      })
      .catch((err) => {
        utils.api.handleError(err, { ...defaultError, message: 'API fetch error (policy.get)' });
        utils.api.handleUnauthorized(err, dispatch, authLogout);
        dispatch(getPolicyFailure(err));
        return err;
      })
      .finally(() => {
        dispatch(removeLoader('getPolicy'));
      });
  };

export const getPolicyRequest = (umrIds, savePolicy) => {
  return {
    type: 'POLICY_GET_REQUEST',
    payload: { umrIds, savePolicy },
  };
};

export const getPolicySuccess = (responseData) => {
  return {
    type: 'POLICY_GET_SUCCESS',
    payload: responseData,
  };
};

export const getPolicyFailure = (error) => {
  return {
    type: 'POLICY_GET_FAILURE',
    payload: error,
  };
};
