import { authLogout, addLoader, removeLoader } from 'stores';
import * as utils from 'utils';

export const getLossQualifiers = (params) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}} = getState();

  const defaultError = {
    file: 'stores/claims.actions.getLossQualifiers',
  };

  const viewLoader = params?.viewLoader ?? true;

  dispatch(getLossQualifiersRequest());
  viewLoader && dispatch(addLoader('getLossQualifiers'));

  return utils.api
    .get({
      token: auth.accessToken,
      endpoint: endpoint.claimService,
      path: 'api/data/gui/loss-qualifiers',
    })
    .then((response) => utils.api.handleResponse(response))
    .then((data) => {
      dispatch(getLossQualifiersSuccess(data.data));
      return data.data;
    })
    .catch((err) => {
      dispatch(getLossQualifiersCodesFailure(err, defaultError));
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      return err;
    })
    .finally(() => {
      viewLoader && dispatch(removeLoader('getLossQualifiers'));
    });
};

export const getLossQualifiersRequest = (data) => {
  return {
    type: 'CLAIMS_LOSS_QUALIFIERS_GET_REQUEST',
    payload: data,
  };
};

export const getLossQualifiersSuccess = (data) => {
  return {
    type: 'CLAIMS_LOSS_QUALIFIERS_GET_SUCCESS',
    payload: data,
  };
};

export const getLossQualifiersCodesFailure = (data) => {
  return {
    type: 'CLAIMS_LOSS_QUALIFIERS_GET_FAILURE',
    payload: data,
  };
};
