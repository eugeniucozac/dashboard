import { addLoader, removeLoader, enqueueNotification, authLogout } from 'stores';
import * as utils from 'utils';

export const postComplexityDivisionMatrix = (updatedMatrixData) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint } } } = getState();

  const defaultError = {
    file: 'stores/claims.actions.postComplexityDivisionMatrix',
  };

  dispatch(postComplexityDivisionMatrixRequest(updatedMatrixData));
  dispatch(addLoader('postComplexityDivisionMatrix'));

  return utils.api
    .post({
      token: auth.accessToken,
      endpoint: endpoint.claimService,
      path: 'api/data/claims-triage/complex/division/save',
      data: updatedMatrixData,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleNewData(json, true))
    .then((data) => {
      dispatch(enqueueNotification('notification.divisionComplexity.success', 'success'));
      return data;
    })
    .catch((err) => {
      dispatch(postComplexityDivisionMatrixFailure(err, defaultError));
      dispatch(enqueueNotification('notification.divisionComplexity.fail', 'error'));
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      return err;
    })
    .finally(() => {
      dispatch(removeLoader('postComplexityDivisionMatrix'));
    });
};

export const postComplexityDivisionMatrixRequest = (updatedMatrixData) => {
  return {
    type: 'CLAIMS_COMPLEXITY_DIVISION_SAVE_REQUEST',
    payload: updatedMatrixData,
  };
};

export const postComplexityDivisionMatrixSuccess = () => {
  return {
    type: 'CLAIMS_COMPLEXITY_DIVISION_SAVE_SUCCESS',
  };
};

export const postComplexityDivisionMatrixFailure = (err) => {
  return {
    type: 'CLAIMS_COMPLEXITY_DIVISION_SAVE_FAILURE',
    payload: err,
  };
};
