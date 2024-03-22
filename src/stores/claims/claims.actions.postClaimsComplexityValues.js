import { addLoader, enqueueNotification, removeLoader, hideModal } from 'stores';
import * as utils from 'utils';
import { getComplexityBasisValue, authLogout } from 'stores';
import * as constants from 'consts';

export const postClaimsComplexityValues = (formData) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint } } } = getState();

  const defaultError = {
    file: 'stores/claims.actions.postClaimsComplexityValues',
  };

  dispatch(postClaimsComplexityValuesRequest(formData));
  dispatch(addLoader('postClaimsComplexityValues'));

  return utils.api
    .post({
      token: auth.accessToken,
      endpoint: endpoint.claimService,
      path: 'api/data/claims-triage/complex/complexity-values',
      data: formData,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleNewData(json))
    .then((data) => {
      dispatch(postClaimsComplexityValuesSuccess(data.data));
      dispatch(enqueueNotification('notification.addComplexityValue.success', 'success'));
      dispatch(getComplexityBasisValue());
      dispatch(hideModal());
      return data;
    })
    .catch((err) => {
      utils.api.handleError(err, { ...defaultError, message: 'API fetch error (claims.postClaimComplexityValues)' });
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(postClaimsComplexityValuesFailure(err));
      dispatch(
        err?.response?.status === constants.API_STATUS_CONFLICT
          ? enqueueNotification('notification.addComplexityValue.duplicate', 'error')
          : enqueueNotification('notification.addComplexityValue.fail', 'error')
      );
      return err;
    })
    .finally(() => {
      dispatch(removeLoader('postClaimsComplexityValues'));
    });
};

export const postClaimsComplexityValuesRequest = (formData) => {
  return {
    type: 'CLAIMS_ADD_COMPLEXITY_VALUES_REQUEST',
    payload: formData,
  };
};

export const postClaimsComplexityValuesSuccess = (data) => {
  return {
    type: 'CLAIMS_ADD_COMPLEXITY_VALUES_SUCCESS',
    payload: data,
  };
};

export const postClaimsComplexityValuesFailure = (err) => {
  return {
    type: 'CLAIMS_ADD_COMPLEXITY_VALUES_FAILURE',
    payload: err,
  };
};
