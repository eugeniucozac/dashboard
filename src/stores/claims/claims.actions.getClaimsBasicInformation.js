import { authLogout, addLoader, removeLoader } from 'stores';
import * as utils from 'utils';

export const getClaimsBasicInformation =
  (claimId, claimRef, sourceId, divisionId, viewLoader = true) =>
  (dispatch, getState) => {
    // prettier-ignore
    const { user: { auth }, config: { vars: { endpoint } } } = getState();

    const defaultError = {
      file: 'stores/claims.actions.getClaimsBasicInformation',
    };

    dispatch(getClaimsBasicInformationRequest({ claimId, claimRef, sourceId, divisionId, viewLoader }));
    viewLoader && dispatch(addLoader('getClaimsBasicInformation'));

    if (!claimId || !claimRef || !sourceId || !divisionId) {
      dispatch(getClaimsBasicInformationFailure({ ...defaultError, message: 'Missing request params' }));
    }

    return utils.api
      .get({
        token: auth.accessToken,
        endpoint: endpoint.claimService,
        path: `api/data/claims/${claimId}/basic-detail`,
        params: {
          sourceId,
          claimRef,
          divisionId,
          isBasicDetail: true,
        },
      })
      .then((response) => utils.api.handleResponse(response))
      .then((data) => {
        dispatch(getClaimsBasicInformationSuccess(data.data));
        return data.data;
      })
      .catch((err) => {
        dispatch(getClaimsBasicInformationFailure(err, defaultError));
        utils.api.handleUnauthorized(err, dispatch, authLogout);
        return err;
      })
      .finally(() => {
        viewLoader && dispatch(removeLoader('getClaimsBasicInformation'));
      });
  };

export const getClaimsBasicInformationRequest = (params) => {
  return {
    type: 'CLAIMS_BASIC_INFORMATION_GET_REQUEST',
    payload: params,
  };
};

export const getClaimsBasicInformationSuccess = (data) => {
  return {
    type: 'CLAIMS_BASIC_INFORMATION_GET_SUCCESS',
    payload: data,
  };
};

export const getClaimsBasicInformationFailure = (err) => {
  return {
    type: 'CLAIMS_BASIC_INFORMATION_GET_FAILURE',
    payload: err,
  };
};
