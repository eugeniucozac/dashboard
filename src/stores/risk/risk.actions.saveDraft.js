import { addLoader, authLogout, enqueueNotification, hideModal, removeLoader } from 'stores';
import * as utils from 'utils';
import isEmpty from 'lodash/isEmpty';

export const postRiskDraft = (values, productType, definitions, draftId) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint } } } = getState();

  const defaultError = {
    file: 'stores/risk.actions.postRiskDraft',
    message: 'Data missing for POST request',
  };

  dispatch(postRiskDraftRequest(values));
  dispatch(addLoader('postRiskDraft'));

  if (!values || isEmpty(values) || !productType || !utils.generic.isValidArray(definitions)) {
    dispatch(postRiskDraftFailure(defaultError));
    dispatch(enqueueNotification('notification.generic.request', 'error'));
    dispatch(hideModal());
    dispatch(removeLoader('postRiskDraft'));
    return;
  }

  const transFormedValues = { ...utils.risk.parsedValues(utils.risk.filterConditionalValues(values, definitions), definitions) };
  const body = {
    id: draftId ? draftId : null,
    risk: {
      ...transFormedValues,
      riskType: productType,
      address: {
        ...transFormedValues.address,
        country: null,
      },
      ownerAddress: {
        ...transFormedValues.ownerAddress,
        country: null,
      },
    },
  };
  return utils.api
    .post({
      token: auth.accessToken,
      endpoint: endpoint.auth,
      path: 'api/v1/risks/drafts',
      data: body,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleResponseJsonObject(json))
    .then((data) => {
      dispatch(postRiskDraftSuccess(data, draftId));
      dispatch(enqueueNotification(`${draftId ? 'notification.editDraft.success' : 'notification.saveDraft.success'}`, 'success'));
    })
    .catch((err) => {
      const errorParams = {
        ...defaultError,
        message: 'API post error (risk.postRiskDraft)',
      };

      utils.api.handleError(err, errorParams);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(postRiskDraftFailure(err));
      dispatch(enqueueNotification(utils.api.getErrorMessage(err), 'error'));
      dispatch(hideModal());
      dispatch(removeLoader('postRiskDraft'));
      return err;
    })
    .finally(() => {
      dispatch(hideModal());
      dispatch(removeLoader('postRiskDraft'));
      return;
    });
};

export const postRiskDraftRequest = (formData) => {
  return {
    type: 'DRAFT_RISK_POST_REQUEST',
    payload: formData,
  };
};

export const postRiskDraftSuccess = (responseData, draftId) => {
  return {
    type: draftId ? 'DRAFT_RISK_UPDATE_SUCCESS' : 'DRAFT_RISK_POST_SUCCESS',
    payload: responseData,
  };
};

export const postRiskDraftFailure = (error) => {
  return {
    type: 'DRAFT_RISK_POST_FAILURE',
    payload: error,
  };
};
