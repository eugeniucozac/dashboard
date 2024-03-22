import { addLoader, authLogout, enqueueNotification, hideModal, removeLoader } from 'stores';
import * as utils from 'utils';

export const putFacilityDetails =
  (formData = {}, facilityId) =>
  (dispatch, getState) => {
    // prettier-ignore
    const { user: { auth }, config: { vars: { endpoint } } } = getState();

    const defaultError = {
      file: 'stores/risk.actions.putFacilityDetails',
      message: 'Data missing for PUT request',
    };

    dispatch(putFacilityRequest({ formData, facilityId }));
    dispatch(addLoader('putFacilityDetails'));

    if (!facilityId) {
      dispatch(putFacilityRatesFailure(defaultError));
      dispatch(enqueueNotification('notification.generic.request', 'error'));
      dispatch(hideModal());
      dispatch(removeLoader('putFacilityDetails'));
      return;
    }

    const body = {
      preBind: formData?.preBind,
      permissionToBindGroups: formData?.permissionToBindGroups?.map((prog) => prog.value),
      notifiedUsers: formData?.notifiedUsers,
      permissionToDismissIssuesGroups: formData?.permissionToDismissIssuesGroups.map((item) => item.value),
    };

    return utils.api
      .put({
        token: auth.accessToken,
        endpoint: endpoint.auth,
        path: `api/v1/facilities/${facilityId}/settings`,
        data: body,
      })
      .then((response) => utils.api.handleResponse(response))
      .then((json) => utils.api.handleResponseJsonObject(json))
      .then((data) => {
        dispatch(putFacilityDetailsSuccess(data));
        dispatch(enqueueNotification('notification.putFacilityDetails.success', 'success'));
      })
      .catch((err) => {
        const errorParams = {
          ...defaultError,
          message: 'API post error (risk.putFacilityDetails)',
        };

        utils.api.handleError(err, errorParams);
        utils.api.handleUnauthorized(err, dispatch, authLogout);
        dispatch(putFacilityRatesFailure(err));
        dispatch(enqueueNotification(utils.api.getErrorMessage(err), 'error'));
        return err;
      })
      .finally(() => {
        dispatch(hideModal());
        dispatch(removeLoader('putFacilityDetails'));
        return;
      });
  };

export const putFacilityRequest = (formData) => {
  return {
    type: 'RISK_FACILITY_PUT_REQUEST',
    payload: formData,
  };
};

export const putFacilityDetailsSuccess = (responseData) => {
  return {
    type: 'RISK_FACILITY_DETAILS_PUT_SUCCESS',
    payload: responseData,
  };
};

export const putFacilityRatesFailure = (error) => {
  return {
    type: 'RISK_FACILITY_PUT_FAILURE',
    payload: error,
  };
};
