import { authLogout, enqueueNotification } from 'stores';
import * as utils from 'utils';
import isEmpty from 'lodash/isEmpty';

export const postCoverages =
  ({ riskId, riskType, data, definitions, coverageId, isEdit = false }) =>
  (dispatch, getState) => {
    // prettier-ignore
    const { user: { auth }, config: { vars: { endpoint }}} = getState();

    const defaultError = {
      file: 'stores/risk.actions.postCoverages',
      message: 'Data missing for POST request',
    };

    if (!data || isEmpty(data) || !riskId || !riskType) {
      dispatch(postCoverageFailure(defaultError));
      dispatch(enqueueNotification('notification.generic.request', 'error'));
      return;
    }

    const body = {
      ...utils.risk.parsedValues(utils.risk.filterConditionalValues(data, definitions), definitions),
      riskType,
    };
    const path = isEdit && coverageId ? `api/v1/risks/${riskId}/coverages/${coverageId}` : `api/v1/risks/${riskId}/coverages`;

    dispatch(postCoverageRequest(data));

    return utils.api
      .post({
        token: auth.accessToken,
        endpoint: endpoint.auth,
        path,
        data: body,
      })
      .then((response) => utils.api.handleResponse(response))
      .then((data) => {
        isEdit && coverageId ? dispatch(postCoverageEditSuccess(data, coverageId)) : dispatch(postCoverageSuccess(data));
        dispatch(enqueueNotification('notification.coverage.postSuccess', 'success'));
        return data;
      })
      .catch((err) => {
        const errorParams = {
          ...defaultError,
          message: 'API post error (risk.Coverage)',
        };

        utils.api.handleError(err, errorParams);
        utils.api.handleUnauthorized(err, dispatch, authLogout);
        dispatch(postCoverageFailure(err));
        dispatch(enqueueNotification(utils.api.getErrorMessage(err), 'error'));
        return err;
      });
  };

export const postCoverageRequest = (formData) => {
  return {
    type: 'RISK_COVERAGE_POST_REQUEST',
    payload: formData,
  };
};

export const postCoverageSuccess = (responseData) => {
  return {
    type: 'RISK_COVERAGE_POST_SUCCESS',
    payload: responseData,
  };
};

export const postCoverageEditSuccess = (responseData, coverageId) => {
  return {
    type: 'RISK_COVERAGE_POST_EDIT_SUCCESS',
    payload: {
      responseData,
      coverageId,
    },
  };
};

export const postCoverageFailure = (error) => {
  return {
    type: 'RISK_COVERAGE_POST_FAILURE',
    payload: error,
  };
};
