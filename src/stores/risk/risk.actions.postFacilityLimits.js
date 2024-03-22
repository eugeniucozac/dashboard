import { addLoader, authLogout, enqueueNotification, hideModal, removeLoader } from 'stores';
import * as utils from 'utils';
export const postFacilityLimits =
  (formData = {}, facilityId, limitsId) =>
  (dispatch, getState) => {
    // prettier-ignore
    const { user: { auth }, config: { vars: { endpoint } } } = getState();
    const { limits } = formData;
    let fieldLimits = [];
    const defaultError = {
      file: 'stores/risk.actions.postFacilityLimits',
      message: 'Data missing for POST request',
    };
    dispatch(postFacilityLimitsRequest({ formData, facilityId }));
    dispatch(addLoader('postFacilityLimits'));
    if (!facilityId || !limits) {
      dispatch(postFacilityLimitsFailure(defaultError));
      dispatch(enqueueNotification('notification.generic.request', 'error'));
      dispatch(hideModal());
      dispatch(removeLoader('postFacilityLimits'));
      return;
    }
    limits?.forEach((obj) => {
      const index = fieldLimits.findIndex((item) => item.fieldName === obj['fieldName']);
      if (index > -1) {
        fieldLimits[index] = {
          ...fieldLimits[index],
          valueLimits: [
            {
              fieldValue: obj['limitFieldOptions']?.value,
              limit: obj['limit'],
              alertRate: obj['alert'],
              label: obj['limitFieldOptions'].label,
            },
            ...fieldLimits[index].valueLimits,
          ],
        };
      } else {
        fieldLimits.push({
          fieldName: obj['fieldName'],
          label: obj.label,
          qualifier: obj.qualifier,
          valueLimits: [
            {
              fieldValue: obj['limitFieldOptions']?.value,
              limit: obj['limit'],
              alertRate: obj['alert'],
              label: obj['limitFieldOptions'].label,
            },
          ],
        });
      }
    });
    const body = {
      ...(limitsId && { id: limitsId }),
      facilityId,
      fieldLimits,
    };
    return utils.api
      .post({
        token: auth.accessToken,
        endpoint: endpoint.auth,
        path: `api/v1/limits?facilityId=${facilityId}`,
        data: body,
      })
      .then((response) => utils.api.handleResponse(response))
      .then((json) => utils.api.handleResponseJsonObject(json))
      .then((data) => {
        dispatch(postFacilityLimitsSuccess(data));
        dispatch(enqueueNotification('notification.postFacilityLimits.success', 'success'));
      })
      .catch((err) => {
        const errorParams = {
          ...defaultError,
          message: 'API post error (risk.postFacilityLimits)',
        };
        utils.api.handleError(err, errorParams);
        utils.api.handleUnauthorized(err, dispatch, authLogout);
        dispatch(postFacilityLimitsFailure(err));
        dispatch(enqueueNotification(utils.api.getErrorMessage(err), 'error'));
        return err;
      })
      .finally(() => {
        dispatch(hideModal());
        dispatch(removeLoader('postFacilityLimits'));
        return;
      });
  };
export const postFacilityLimitsRequest = (formData) => {
  return {
    type: 'RISK_FACILITY_LIMITS_POST_REQUEST',
    payload: formData,
  };
};
export const postFacilityLimitsSuccess = (responseData) => {
  return {
    type: 'RISK_FACILITY_LIMITS_POST_SUCCESS',
    payload: responseData,
  };
};
export const postFacilityLimitsFailure = (error) => {
  return {
    type: 'RISK_FACILITY_LIMITS_POST_FAILURE',
    payload: error,
  };
};
