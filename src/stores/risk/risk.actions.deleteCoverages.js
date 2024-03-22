import { authLogout, enqueueNotification } from 'stores';
import * as utils from 'utils';

export const deleteCoverages = (coverageId, riskId) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint } } } = getState();

  const defaultError = {
    file: 'stores/risk.actions.deleteCoverages',
    message: 'Data missing for DELETE request',
  };

  dispatch(deleteCoveragesRequest(coverageId));

  if (!coverageId || !riskId) {
    dispatch(deleteCoveragesFailure(defaultError));
    dispatch(enqueueNotification('notification.deleteCoverages.fail', 'error'));
    return;
  }

  return utils.api
    .delete({
      token: auth.accessToken,
      endpoint: endpoint.auth,
      path: `api/v1/risks/${riskId}/coverages/${coverageId}`,
    })
    .then((response) => utils.api.handleEmptyResponse(response))
    .then(() => {
      dispatch(deleteCoveragesSuccess(coverageId));
      dispatch(enqueueNotification('notification.deleteCoverages.success', 'success'));
    })
    .catch((err) => {
      const errorParams = {
        ...defaultError,
        message: 'API delete error (risk.deleteCoverages)',
      };
      utils.api.handleError(err, errorParams);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(deleteCoveragesFailure(err));
      dispatch(enqueueNotification('notification.deleteCoverages.fail', 'error'));

      return err;
    });
};

export const deleteCoveragesRequest = (coverageId) => {
  return {
    type: 'RISK_COVERAGE_DELETE_REQUEST',
    payload: coverageId,
  };
};

export const deleteCoveragesSuccess = (coverageId) => {
  return {
    type: 'RISK_COVERAGE_DELETE_SUCCESS',
    payload: coverageId,
  };
};

export const deleteCoveragesFailure = (error) => {
  return {
    type: 'RISK_COVERAGE_DELETE_FAILURE',
    payload: error,
  };
};
