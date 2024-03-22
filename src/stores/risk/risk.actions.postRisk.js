import { addLoader, authLogout, enqueueNotification, hideModal, removeLoader, deleteDraft } from 'stores';
import * as utils from 'utils';
import isEmpty from 'lodash/isEmpty';

export const postRisk = (values, productType, definitions, draftId) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}} = getState();

  const defaultError = {
    file: 'stores/risk.actions.postRisk',
    message: 'Data missing for POST request',
  };

  dispatch(postRiskRequest(values));
  dispatch(addLoader('postRisk'));

  if (!values || isEmpty(values) || !productType || !utils.generic.isValidArray(definitions)) {
    dispatch(postRiskFailure(defaultError));
    dispatch(enqueueNotification('notification.generic.request', 'error'));
    dispatch(hideModal());
    dispatch(removeLoader('postRisk'));
    return;
  }

  const body = {
    ...utils.risk.parsedValues(utils.risk.filterConditionalValues(values, definitions), definitions),
    riskType: productType,
  };

  return utils.api
    .post({
      token: auth.accessToken,
      endpoint: endpoint.auth,
      path: 'api/v1/risks',
      data: body,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleResponseJsonObject(json))
    .then((data) => {
      if (draftId) {
        dispatch(deleteDraft(draftId, true));
      }

      dispatch(postRiskSuccess(data));
      dispatch(enqueueNotification('notification.saveRisk.success', 'success'));

      return data;
    })
    .catch((err) => {
      const errorParams = {
        ...defaultError,
        message: 'API post error (risk.postRisk)',
      };

      utils.api.handleError(err, errorParams);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(postRiskFailure(err));
      dispatch(enqueueNotification(utils.api.getErrorMessage(err), 'error'));
      return err;
    })
    .finally(() => {
      dispatch(hideModal());
      dispatch(removeLoader('postRisk'));
      return;
    });
};

export const postRiskRequest = (formData) => {
  return {
    type: 'RISK_POST_REQUEST',
    payload: formData,
  };
};

export const postRiskSuccess = (responseData) => {
  return {
    type: 'RISK_POST_SUCCESS',
    payload: responseData,
  };
};

export const postRiskFailure = (error) => {
  return {
    type: 'RISK_POST_FAILURE',
    payload: error,
  };
};
