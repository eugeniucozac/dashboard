import { authLogout, addLoader, removeLoader } from 'stores';
import * as utils from 'utils';

export const getLossInformation =
  ({ lossDetailsId, sourceIdParams, divisionIdParam, claimRefParam, viewLoader = true }) =>
  (dispatch, getState) => {
    // prettier-ignore
    const { user: { auth }, config: { vars: { endpoint } } } = getState();
    const defaultError = {
      file: 'stores/claims.actions.getLossInformation',
    };

    let requestObj = {
      lossDetailsId: lossDetailsId ?? '0',
      sourceIdParams: sourceIdParams,
    };
    dispatch(getLossInformationRequest(requestObj));
    viewLoader && dispatch(addLoader('getLossInformation'));
    const sourceId = sourceIdParams ? sourceIdParams : '';
    return utils.api
      .get({
        token: auth.accessToken,
        endpoint: endpoint.claimService,
        path: `api/data/loss/${lossDetailsId ?? '0'}`,
        params: {
          sourceId,
          divisionId: divisionIdParam ? divisionIdParam : '',
          claimRef: claimRefParam ? claimRefParam : '',
        },
      })
      .then((response) => utils.api.handleResponse(response))
      .then((data) => {
        dispatch(getLossInformationSuccess(data.data));
        return data.data;
      })
      .catch((err) => {
        dispatch(getLossInformationFailure(err, defaultError));
        utils.api.handleUnauthorized(err, dispatch, authLogout);
        return err;
      })
      .finally(() => {
        viewLoader && dispatch(removeLoader('getLossInformation'));
      });
  };

export const getLossInformationRequest = (data) => {
  return {
    type: 'GET_LOSS_INFORMATION_REQUEST',
    payload: data,
  };
};

export const getLossInformationSuccess = (data) => {
  return {
    type: 'GET_LOSS_INFORMATION_SUCCESS',
    payload: data,
  };
};

export const getLossInformationFailure = (data) => {
  return {
    type: 'GET_LOSS_INFORMATION_FAILURE',
    payload: data,
  };
};
