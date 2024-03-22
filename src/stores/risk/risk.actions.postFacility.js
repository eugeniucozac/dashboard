import { addLoader, authLogout, enqueueNotification, removeLoader, hideModal } from 'stores';
import * as utils from 'utils';
import isEmpty from 'lodash/isEmpty';

export const postFacility = (body) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}} = getState();

  const defaultError = {
    file: 'stores/risk.actions.postFacility',
    message: 'Data missing for POST request',
  };

  if (!body || isEmpty(body)) {
    dispatch(postFacilityFailure(defaultError));
    dispatch(enqueueNotification('notification.generic.request', 'error'));
    dispatch(removeLoader('postFacility'));
    return;
  }
  const { permissionToBindGroups, permissionToDismissIssuesGroups, notifiedUsers, ...rest } = body;

  const data = {
    ...rest,
    permissionToBindGroups: permissionToBindGroups?.map((prog) => prog.value),
    permissionToDismissIssuesGroups: permissionToDismissIssuesGroups?.map((item) => item.value),
    notifiedUsers: notifiedUsers.map((user) => {
      return {
        name: user.name,
        email: user.email,
      };
    }),
  };

  dispatch(postFacilityRequest(body));
  dispatch(addLoader('postFacility'));

  return utils.api
    .post({
      token: auth.accessToken,
      endpoint: endpoint.auth,
      path: 'api/v1/facilities',
      data,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((data) => {
      dispatch(postFacilitySuccess(data));
      dispatch(enqueueNotification('notification.facility.postSuccess', 'success'));
      return data;
    })
    .catch((err) => {
      const errorParams = {
        ...defaultError,
        message: 'API post error (risk.postFacility)',
      };

      utils.api.handleError(err, errorParams);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(postFacilityFailure(err));
      dispatch(enqueueNotification(utils.api.getErrorMessage(err), 'error'));
      return err;
    })
    .finally(() => {
      dispatch(hideModal());
      dispatch(removeLoader('postFacility'));
    });
};

export const postFacilityRequest = (formData) => {
  return {
    type: 'RISK_FACILITIES_POST_REQUEST',
    payload: formData,
  };
};

export const postFacilitySuccess = (responseData) => {
  return {
    type: 'RISK_FACILITIES_POST_SUCCESS',
    payload: responseData,
  };
};

export const postFacilityFailure = (error) => {
  return {
    type: 'RISK_FACILITIES_POST_FAILURE',
    payload: error,
  };
};
