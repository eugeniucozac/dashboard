import { authLogout, addLoader, removeLoader } from 'stores';
import * as utils from 'utils';

export const getCatCodes =
  (viewLoader = true) =>
  (dispatch, getState) => {
    // prettier-ignore
    const { user: { auth }, config: { vars: { endpoint }}} = getState();

    const defaultError = {
      file: 'stores/claims.actions.getCatCodes',
    };

    dispatch(getCatCodesRequest());
    viewLoader && dispatch(addLoader('getCatCodes'));

    return utils.api
      .get({
        token: auth.accessToken,
        endpoint: endpoint.claimService,
        path: 'api/data/gui/cat-codes',
      })
      .then((response) => utils.api.handleResponse(response))
      .then((json) => utils.api.handleNewData(json))
      .then((data) => {
        dispatch(getCatCodesSuccess(data.data));
        return data.data;
      })
      .catch((err) => {
        dispatch(getCatCodesCodesFailure(err, defaultError));
        utils.api.handleUnauthorized(err, dispatch, authLogout);
        return err;
      })
      .finally(() => {
        viewLoader && dispatch(removeLoader('getCatCodes'));
      });
  };

export const getCatCodesRequest = (data) => {
  return {
    type: 'CLAIMS_CAT_CODES_GET_REQUEST',
    payload: data,
  };
};

export const getCatCodesSuccess = (data) => {
  return {
    type: 'CLAIMS_CAT_CODES_GET_SUCCESS',
    payload: data,
  };
};

export const getCatCodesCodesFailure = (err) => {
  return {
    type: 'CLAIMS_CAT_CODES_GET_FAILURE',
    payload: err,
  };
};
