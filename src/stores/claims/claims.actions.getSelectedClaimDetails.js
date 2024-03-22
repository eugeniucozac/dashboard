import { authLogout, addLoader, removeLoader } from 'stores';
import * as utils from 'utils';

import get from 'lodash/get';

export const getSelectedClaimDetails =
  ({ claimId, claimRefParams, sourceIdParams, divisionIDParams, viewLoader = true }) =>
  (dispatch, getState) => {
    // prettier-ignore
    const { user: { auth }, config: { vars: { endpoint } } } = getState();
    const defaultError = {
      file: 'stores/claims.actions.getSelectedClaimDetails',
    };

    const state = getState();
    const claimSubmissionId = claimId ? claimId : get(state, 'claims.claimsInformation.claimId') || '';
    const sourceId = sourceIdParams ? sourceIdParams : get(state, 'claims.claimsInformation.sourceId');
    const claimRef = claimRefParams ? claimRefParams : get(state, 'claims.claimsInformation.claimReference');
    const divisionId = divisionIDParams ? divisionIDParams : get(state, 'claims.claimsInformation.departmentID');

    dispatch(getSelectedClaimDetailsRequest(claimSubmissionId));
    viewLoader && dispatch(addLoader('getSelectedClaimDetails'));
    return utils.api
      .get({
        token: auth.accessToken,
        endpoint: endpoint.claimService,
        path: `api/data/claims/${claimSubmissionId}/basic-detail`,
        params: {
          sourceId,
          claimRef,
          divisionId,
        },
      })
      .then((response) => utils.api.handleResponse(response))
      .then((data) => {
        dispatch(getSelectedClaimDetailsSuccess(data.data));
        return data.data;
      })
      .catch((err) => {
        dispatch(getSelectedClaimDetailsFailure(err, defaultError));
        utils.api.handleUnauthorized(err, dispatch, authLogout);
        return err;
      })
      .finally(() => {
        viewLoader && dispatch(removeLoader('getSelectedClaimDetails'));
      });
  };

export const getSelectedClaimDetailsRequest = (data) => {
  return {
    type: 'CLAIMS_SELECTED_INFORMATION_GET_REQUEST',
    payload: { data },
  };
};

export const getSelectedClaimDetailsSuccess = (data) => {
  return {
    type: 'CLAIMS_SELECTED_INFORMATION_GET_SUCCESS',
    payload: data,
  };
};

export const getSelectedClaimDetailsFailure = (data) => {
  return {
    type: 'CLAIMS_SELECTED_INFORMATION_GET_FAILURE',
    payload: data,
  };
};
