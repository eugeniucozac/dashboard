import { authLogout, enqueueNotification, hideModal, getRiskDetails, getRiskQuotes, getCoverages } from 'stores';
import * as utils from 'utils';
import isEmpty from 'lodash/isEmpty';

export const patchRisk = (values, productType, definitions, riskId) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}} = getState();

  const defaultError = {
    file: 'stores/risk.actions.patchRisk',
    message: 'Data missing for PATCH request',
  };

  dispatch(patchRiskRequest(values));

  if (!riskId || !values || isEmpty(values) || !productType || !utils.generic.isValidArray(definitions)) {
    dispatch(patchRiskFailure(defaultError));
    dispatch(enqueueNotification('notification.generic.request', 'error'));
    dispatch(hideModal());
    return;
  }

  const body = {
    ...utils.risk.parsedValues(utils.risk.filterConditionalValues(values, definitions), definitions),
    riskType: productType,
  };

  const data = {
    id: riskId,
    ...body,
  };

  return utils.api
    .patch({
      token: auth.accessToken,
      endpoint: endpoint.auth,
      path: `api/v1/risks/${riskId}`,
      data,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleResponseJsonObject(json))
    .then((data) => {
      dispatch(patchRiskSuccess(data));
      dispatch(enqueueNotification('notification.reQuote.success', 'success'));
      return data;
    })
    .then((data) => {
      dispatch(getRiskDetails(data?.id, true));
      dispatch(getRiskQuotes(data?.id));
      dispatch(getCoverages(data?.id));

      return data;
    })
    .catch((err) => {
      const errorParams = {
        ...defaultError,
        message: 'API patch error (risk.patchRisk)',
      };

      utils.api.handleError(err, errorParams);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(patchRiskFailure(err));
      dispatch(enqueueNotification(utils.api.getErrorMessage(err), 'error'));
      return err;
    })
    .finally(() => {
      dispatch(hideModal());
      return;
    });
};

export const patchRiskRequest = (formData) => {
  return {
    type: 'RISK_PATCH_REQUEST',
    payload: formData,
  };
};

export const patchRiskSuccess = (responseData) => {
  return {
    type: 'RISK_PATCH_SUCCESS',
    payload: responseData,
  };
};

export const patchRiskFailure = (error) => {
  return {
    type: 'RISK_PATCH_FAILURE',
    payload: error,
  };
};
