import { addLoader, authLogout, enqueueNotification, removeLoader, hideModal } from 'stores';
import * as utils from 'utils';
import isEmpty from 'lodash/isEmpty';

export const postPreBindInfo = (riskId, body) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}} = getState();

  const defaultError = {
    file: 'stores/risk.actions.postPreBindInfo',
    message: 'Data missing for POST request',
  };

  if (!body || isEmpty(body) || !riskId) {
    dispatch(postPreBindInfoFailure(defaultError));
    dispatch(enqueueNotification('notification.generic.request', 'error'));
    dispatch(removeLoader('postPreBindInfo'));
    return;
  }

  const data = { ...body };

  dispatch(postPreBindInfoRequest(data));
  dispatch(addLoader('postPreBindInfo'));

  return utils.api
    .post({
      token: auth.accessToken,
      endpoint: endpoint.auth,
      path: `api/v1/risks/${riskId}/pre-bind`,
      data,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((data) => {
      dispatch(postPreBindInfoSuccess(data));
      dispatch(enqueueNotification('notification.preBindInfo.postSuccess', 'success'));
      return data;
    })
    .catch((err) => {
      const errorParams = {
        ...defaultError,
        message: 'API post error (risk.postPreBindInfo)',
      };

      utils.api.handleError(err, errorParams);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(postPreBindInfoFailure(err));
      dispatch(enqueueNotification(utils.api.getErrorMessage(err), 'error'));
      return err;
    })
    .finally(() => {
      dispatch(hideModal());
      dispatch(removeLoader('postPreBindInfo'));
    });
};

export const postPreBindInfoRequest = (formData) => {
  return {
    type: 'RISK_PREBIND_POST_REQUEST',
    payload: formData,
  };
};

export const postPreBindInfoSuccess = (responseData) => {
  return {
    type: 'RISK_PREBIND_POST_SUCCESS',
    payload: responseData,
  };
};

export const postPreBindInfoFailure = (error) => {
  return {
    type: 'RISK_PREBIND_POST_FAILURE',
    payload: error,
  };
};
