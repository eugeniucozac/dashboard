import { authLogout, enqueueNotification } from 'stores';
import * as utils from 'utils';

export const putActivateCoverages = (coverageId, riskId) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint } } } = getState();

  const defaultError = {
    file: 'stores/risk.actions.putActivateCoverages',
    message: 'Data missing for PUT request',
  };

  dispatch(putActivateCoveragesRequest(coverageId));

  if (!coverageId || !riskId) {
    dispatch(putActivateCoveragesFailure(defaultError));
    dispatch(enqueueNotification('notification.putActivateCoverages.fail', 'error'));
    return;
  }

  return utils.api
    .put({
      token: auth.accessToken,
      endpoint: endpoint.auth,
      path: `api/v1/risks/${riskId}/coverages/${coverageId}`,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((response) => {
      dispatch(putActivateCoveragesSuccess(response));
      dispatch(enqueueNotification('notification.putActivateCoverages.success', 'success'));
      return response;
    })
    .catch((err) => {
      const errorParams = {
        ...defaultError,
        message: 'API delete error (risk.putActivateCoverages)',
      };
      utils.api.handleError(err, errorParams);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(putActivateCoveragesFailure(err));
      dispatch(enqueueNotification('notification.putActivateCoverages.fail', 'error'));

      return err;
    });
};

export const putActivateCoveragesRequest = (coverageId) => {
  return {
    type: 'RISK_COVERAGE_PUT_ACTIVATE_REQUEST',
    payload: coverageId,
  };
};

export const putActivateCoveragesSuccess = (response) => {
  return {
    type: 'RISK_COVERAGE_PUT_ACTIVATE_SUCCESS',
    payload: response,
  };
};

export const putActivateCoveragesFailure = (error) => {
  return {
    type: 'RISK_COVERAGE_PUT_ACTIVATE_FAILURE',
    payload: error,
  };
};
