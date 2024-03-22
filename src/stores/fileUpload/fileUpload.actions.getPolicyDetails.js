import * as utils from 'utils';
import { authLogout } from 'stores';

export const getFileUploadPolicyDetails = (type, riskRefObject) => (dispatch, getState) => {
  // prettier-ignore
  const { user: {auth}, config: { vars: { endpoint }}} = getState();

  const defaultError = {
    file: 'stores/fileUpload.actions.getFileUploadPolicyDetails',
  };

  dispatch(getFileUploadPolicyDetailsRequest(type, riskRefObject));

  if (!['risk', 'claim'].includes(type) || !riskRefObject || !riskRefObject.policyRef || !riskRefObject.xbInstanceId) {
    dispatch(getFileUploadPolicyDetailsFailure({ ...defaultError, message: 'Missing parameters' }));
    return;
  }

  return utils.api
    .get({
      token: auth.accessToken,
      endpoint: endpoint.dmsService,
      path: `data/${type}/reference/${riskRefObject.policyRef}/${riskRefObject.xbInstanceId}`,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => {
      if (json?.status === 'OK' && json?.data) {
        dispatch(getFileUploadPolicyDetailsSuccess(json.data));
        return json.data;
      } else {
        return Promise.reject({
          message: `API error${json.status ? ` (${json.status})` : ''}`,
          ...(json && { ...json }),
        });
      }
    })
    .catch((err) => {
      utils.api.handleError(err, { ...defaultError, message: 'API fetch error (fileUpload.getFileUploadPolicyDetails)' });
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(getFileUploadPolicyDetailsFailure(err));
      return err;
    });
};

export const getFileUploadPolicyDetailsRequest = (type, riskRefObject) => {
  return {
    type: 'FILE_UPLOAD_GET_POLICY_DETAILS_REQUEST',
    payload: { type, riskRefObject },
  };
};

export const getFileUploadPolicyDetailsSuccess = (guiResponseList) => {
  return {
    type: 'FILE_UPLOAD_GET_POLICY_DETAILS_SUCCESS',
    payload: guiResponseList,
  };
};

export const getFileUploadPolicyDetailsFailure = (error) => {
  return {
    type: 'FILE_UPLOAD_GET_POLICY_DETAILS_FAILURE',
    payload: error,
  };
};
