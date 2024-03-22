import { addLoader, authLogout, removeLoader } from 'stores';
import * as utils from 'utils';

export const getReferralResponse = (params) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}} = getState();

  const defaultError = {
    file: 'stores/claims.actions.getReferralResponse',
  };

  const viewLoader = params?.viewLoader ?? true;

  dispatch(getReferralResponseRequest());
  viewLoader && dispatch(addLoader('getReferralResponse'));

  return utils.api
    .get({
      token: auth.accessToken,
      endpoint: endpoint.claimService,
      path: `api/data/gui/complex/referral-response`,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((data) => {
      dispatch(getReferralResponseSuccess(data.data));
      return data.data;
    })
    .catch((err) => {
      dispatch(getReferralResponseFailure(err, defaultError));
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      return err;
    })
    .finally(() => {
      viewLoader && dispatch(removeLoader('getReferralResponse'));
    });
};

export const getReferralResponseRequest = (data) => {
  return {
    type: 'CLAIMS_REFERRAL_RESPONSE_GET_REQUEST',
    payload: data,
  };
};

export const getReferralResponseSuccess = (data) => {
  return {
    type: 'CLAIMS_REFERRAL_RESPONSE_GET_SUCCESS',
    payload: data,
  };
};

export const getReferralResponseFailure = (data) => {
  return {
    type: 'CLAIMS_REFERRAL_RESPONSE_GET_FAILURE',
    payload: data,
  };
};
