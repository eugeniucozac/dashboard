import * as utils from 'utils';
import { authLogout, addLoader, enqueueNotification, removeLoader } from 'stores';
import get from 'lodash/get';

export const submitClaimDetailsInformation = ({successCallback=()=>{}}) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint } }, claims } = getState();
  const defaultError = {
    file: 'stores/claims.actions.submitClaimDetailsInformation',
  };

  const claimId = get(claims, 'claimsInformation.claimID');

  dispatch(submitClaimDetailsInformationRequest(claimId));
  dispatch(addLoader('submitClaimDetailsInformation'));

  return utils.api
    .patch({
      token: auth.accessToken,
      endpoint: endpoint.claimService,
      path: `api/data/claims/${claimId}/submit`,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((data) => {
      dispatch(submitClaimDetailsInformationSuccess(data.data));
      dispatch(enqueueNotification('notification.submitClaimInformation.success', 'success', {
        keepAfterUrlChange: true
      }));
      dispatch(removeLoader('submitClaimDetailsInformation'));
      successCallback(data.data);
    }).catch((err) => {
      const errorParams = {
        ...defaultError,
        message: 'API post error',
      };

      utils.api.handleError(err, errorParams);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(submitClaimDetailsInformationFailure(err));
      dispatch(enqueueNotification('notification.submitClaimInformation.fail', 'error'));
      dispatch(removeLoader('submitClaimDetailsInformation'));
      return err;
    });
};

export const submitClaimDetailsInformationRequest = (data) => {
  return {
    type: 'CLAIMS_DETAILS_INFORMATION_SUBMIT_REQUEST',
    payload: data,
  };
};

export const submitClaimDetailsInformationSuccess = (responseData) => {
  return {
    type: 'CLAIMS_DETAILS_INFORMATION_SUBMIT_SUCCESS',
    payload: { responseData, claimStatus: 'Submitted' },
  };
};

export const submitClaimDetailsInformationFailure = (error) => {
  return {
    type: 'CLAIMS_DETAILS_INFORMATION_SUBMIT_FAILURE',
    payload: error,
  };
};
