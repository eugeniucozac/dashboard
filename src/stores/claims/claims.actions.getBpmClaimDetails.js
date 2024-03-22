import { authLogout, addLoader, removeLoader } from 'stores';
import * as utils from 'utils';

export const getBpmClaimDetails =
  ({ claimId, viewLoader }) =>
  (dispatch, getState) => {
    // prettier-ignore
    const { user: { auth }, config: { vars: { endpoint }}} = getState();

    const defaultError = {
      file: 'stores/claims.actions.getBpmClaimDetails',
    };

    dispatch(getBpmClaimDetailsRequest());
    viewLoader && dispatch(addLoader('getBpmClaimDetails'));

    return utils.api
      .get({
        token: auth.accessToken,
        endpoint: endpoint.bpmService,
        path: `workflow/process/getClaimDetails/${claimId}`,
      })
      .then((response) => utils.api.handleResponse(response))
      .then((json) => utils.api.handleNewData(json))
      .then((data) => {
        dispatch(getBpmClaimDetailsSuccess(data.data));
        return data.data;
      })
      .catch((err) => {
        dispatch(getBpmClaimDetailsFailure(err, defaultError));
        utils.api.handleUnauthorized(err, dispatch, authLogout);
        return err;
      })
      .finally(() => {
        viewLoader && dispatch(removeLoader('getBpmClaimDetails'));
      });
  };

export const getBpmClaimDetailsRequest = (data) => {
  return {
    type: 'GET_BPM_CLAIM_DETAILS_REQUEST',
    payload: data,
  };
};

export const getBpmClaimDetailsSuccess = (data) => {
  return {
    type: 'GET_BPM_CLAIM_DETAILS_SUCCESS',
    payload: data,
  };
};

export const getBpmClaimDetailsFailure = (err) => {
  return {
    type: 'GET_BPM_CLAIM_DETAILS_FAILURE',
    payload: err,
  };
};
