import { authLogout, addLoader, removeLoader } from 'stores';
import * as utils from 'utils';

export const getClaimsAssociateWithLoss =
  (lossDetailID, viewLoader = false) =>
  (dispatch, getState) => {
    // prettier-ignore
    const { user: { auth }, config: { vars: { endpoint } } } = getState();

    const defaultError = {
      file: 'stores/claims.actions.getClaimsAssociateWithLoss',
    };

    dispatch(getClaimsAssociateWithLossRequest());
    viewLoader && dispatch(addLoader('getClaimsAssociateWithLoss'));

    return utils.api
      .get({
        token: auth.accessToken,
        endpoint: endpoint.claimService,
        path: `api/data/claims/loss/${lossDetailID}/claim-list`,
      })
      .then((response) => utils.api.handleResponse(response))
      .then((data) => {
        dispatch(getClaimsAssociateWithLossSuccess(data.data));
        return data.data;
      })
      .catch((err) => {
        dispatch(getClaimsAssociateWithLossFailure(err, defaultError));
        utils.api.handleUnauthorized(err, dispatch, authLogout);
        return err;
      })
      .finally(() => {
        viewLoader && dispatch(removeLoader('getClaimsAssociateWithLoss'));
      });
  };

export const getClaimsAssociateWithLossRequest = (params) => {
  return {
    type: 'CLAIMS_ASSOCIATE_WITH_LOSS_GET_REQUEST',
    payload: params,
  };
};

export const getClaimsAssociateWithLossSuccess = (data) => {
  return {
    type: 'CLAIMS_ASSOCIATE_WITH_LOSS_GET_SUCCESS',
    payload: data,
  };
};

export const getClaimsAssociateWithLossFailure = (error) => {
  return {
    type: 'CLAIMS_ASSOCIATE_WITH_LOSS_GET_FAILURE',
    payload: error,
  };
};
