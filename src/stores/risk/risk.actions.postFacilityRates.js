import { addLoader, authLogout, enqueueNotification, hideModal, removeLoader } from 'stores';
import * as utils from 'utils';
import get from 'lodash/get';
import has from 'lodash/has';
export const postFacilityRates =
  (formData = {}, facilityId, ratesId) =>
  (dispatch, getState) => {
    // prettier-ignore
    const { user: { auth }, config: { vars: { endpoint }}} = getState();
    const { countries = [], brokerageFee, clientCommissionRate, brokerCommissionRate, reinsuranceRate } = formData;

    const defaultError = {
      file: 'stores/risk.actions.postFacilityRates',
      message: 'Data missing for POST request',
    };

    dispatch(postFacilityRatesRequest({ formData, facilityId, ratesId }));
    dispatch(addLoader('postFacilityRates'));

    const hasRatesData =
      has(formData, 'countries') &&
      has(formData, 'brokerageFee') &&
      has(formData, 'clientCommissionRate') &&
      has(formData, 'brokerCommissionRate') &&
      has(formData, 'reinsuranceRate');

    if (!facilityId || !hasRatesData) {
      dispatch(postFacilityRatesFailure(defaultError));
      dispatch(enqueueNotification('notification.generic.request', 'error'));
      dispatch(hideModal());
      dispatch(removeLoader('postFacilityRates'));
      return;
    }

    const body = {
      ...(ratesId && { id: ratesId }),
      facilityId,
      brokerageFee,
      clientCommissionRate,
      brokerCommissionRate,
      reinsuranceRate,
      countryRates: countries.map((country) => {
        return {
          country: get(country, 'countryCode.value'),
          value: get(country, 'rate'),
          refer: get(country, 'refer'),
        };
      }, {}),
    };

    return utils.api
      .post({
        token: auth.accessToken,
        endpoint: endpoint.auth,
        path: `api/v1/rates?facilityId=${facilityId}`,
        data: body,
      })
      .then((response) => utils.api.handleResponse(response))
      .then((json) => utils.api.handleResponseJsonObject(json))
      .then((data) => {
        dispatch(postFacilityRatesSuccess(data));
        dispatch(enqueueNotification('notification.postFacilityRates.success', 'success'));
      })
      .catch((err) => {
        const errorParams = {
          ...defaultError,
          message: 'API post error (risk.postFacilityRates)',
        };
        utils.api.handleError(err, errorParams);
        utils.api.handleUnauthorized(err, dispatch, authLogout);
        dispatch(postFacilityRatesFailure(err));
        dispatch(enqueueNotification(utils.api.getErrorMessage(err), 'error'));
        return err;
      })
      .finally(() => {
        dispatch(hideModal());
        dispatch(removeLoader('postFacilityRates'));
        return;
      });
  };

export const postFacilityRatesRequest = (formData) => {
  return {
    type: 'RISK_FACILITY_RATES_POST_REQUEST',
    payload: formData,
  };
};

export const postFacilityRatesSuccess = (responseData) => {
  return {
    type: 'RISK_FACILITY_RATES_POST_SUCCESS',
    payload: responseData,
  };
};

export const postFacilityRatesFailure = (error) => {
  return {
    type: 'RISK_FACILITY_RATES_POST_FAILURE',
    payload: error,
  };
};
