import { authLogout, addLoader, removeLoader } from 'stores';
import * as utils from 'utils';

import get from 'lodash/get';

export const getClaimsPreviewInformation =
  ({ claimId, claimRefParams, sourceIdParams, divisionIDParams, viewLoader = true } = {}) =>
  (dispatch, getState) => {
    // prettier-ignore
    const { user: { auth }, config: { vars: { endpoint } } } = getState();

    const state = getState();
    const claimSubmissionId = claimId ? claimId : get(state, 'claims.claimsInformation.claimID') || '';
    const sourceId = sourceIdParams ? sourceIdParams : get(state, 'claims.claimsInformation.sourceID');
    const claimRef = claimRefParams ? claimRefParams : get(state, 'claims.claimsInformation.claimReference');
    const divisionId = divisionIDParams ? divisionIDParams : get(state, 'claims.claimsInformation.departmentID');

    dispatch(getClaimsInformationRequest({ claimId, claimRefParams, sourceIdParams, divisionIDParams, viewLoader }));
    viewLoader && dispatch(addLoader('getClaimsInformation'));
    return utils.api
      .get({
        token: auth.accessToken,
        endpoint: endpoint.claimService,
        path: `api/data/claims/${claimSubmissionId}/detail`,
        params: {
          sourceId,
          claimRef,
          divisionId,
        },
      })
      .then((response) => utils.api.handleResponse(response))
      .then((data) => {
        dispatch(getClaimsInformationSuccess(data.data));
        return data.data;
      })
      .catch((err) => {
        dispatch(getClaimsInformationFailure(err));
        utils.api.handleUnauthorized(err, dispatch, authLogout);
        return err;
      })
      .finally(() => {
        viewLoader && dispatch(removeLoader('getClaimsInformation'));
      });
  };

export const getClaimsInformationRequest = (params) => {
  return {
    type: 'CLAIMS_PREVIEW_INFORMATION_GET_REQUEST',
    payload: params,
  };
};

export const getClaimsInformationSuccess = (data) => {
  return {
    type: 'CLAIMS_PREVIEW_INFORMATION_GET_SUCCESS',
    payload: data,
  };
};

export const getClaimsInformationFailure = (err) => {
  return {
    type: 'CLAIMS_PREVIEW_INFORMATION_GET_FAILURE',
    payload: err,
  };
};
