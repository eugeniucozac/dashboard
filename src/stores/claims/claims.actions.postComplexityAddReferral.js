import { addLoader, removeLoader, enqueueNotification, hideModal, authLogout } from 'stores';
import * as utils from 'utils';
import { getComplexityReferralValues } from 'stores';
import * as constants from 'consts';

export const postComplexityAddReferral = (formData) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint } } } = getState();

  const defaultError = {
    file: 'stores/claims.actions.postComplexityAddReferral',
  };

  const requestBody = {
    complexityRulesValue: formData.addReferralValue,
  };

  dispatch(postComplexityAddReferralRequest(formData));
  dispatch(addLoader('postComplexityAddReferral'));

  return utils.api
    .post({
      token: auth.accessToken,
      endpoint: endpoint.claimService,
      path: 'api/data/claims-triage/complex/referral-value',
      data: requestBody,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleNewData(json))
    .then((data) => {
      dispatch(postComplexityAddReferralSuccess(data.data));
      dispatch(enqueueNotification('notification.addReferral.success', 'success'));
      dispatch(getComplexityReferralValues());
      dispatch(hideModal());
      return data;
    })
    .catch((err) => {
      dispatch(postComplexityAddReferralFailure(err, defaultError));
      dispatch(
        err?.response?.status === constants.API_STATUS_CONFLICT
          ? enqueueNotification('notification.addReferral.duplicate', 'error')
          : enqueueNotification('notification.addReferral.fail', 'error')
      );
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      return err;
    })
    .finally(() => {
      dispatch(removeLoader('postComplexityAddReferral'));
    });
};

export const postComplexityAddReferralRequest = (formData) => {
  return {
    type: 'CLAIMS_COMPLEXITY_ADD_REFERRAL_REQUEST',
    payload: formData,
  };
};

export const postComplexityAddReferralSuccess = (data) => {
  return {
    type: 'CLAIMS_COMPLEXITY_ADD_REFERRAL_SUCCESS',
    payload: data,
  };
};

export const postComplexityAddReferralFailure = (err) => {
  return {
    type: 'CLAIMS_COMPLEXITY_ADD_REFERRAL_FAILURE',
    payload: err,
  };
};
