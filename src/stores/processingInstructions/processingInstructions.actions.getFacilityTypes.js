import * as utils from 'utils';
import { addLoader, removeLoader, authLogout } from 'stores';

export const getFacilityTypes = () => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}} = getState();

  const defaultError = {
    file: 'stores/processingInstructions.actions.getFacilityTypes',
  };

  dispatch(getFacilityTypesRequest());
  dispatch(addLoader('getFacilityTypes'));

  return utils.api
    .get({
      token: auth.accessToken,
      endpoint: endpoint.odsService,
      path: `referenceData/FacilityType`,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleNewData(json))
    .then((data) => {
      dispatch(getFacilityTypesSuccess(data.data.facilityType));
      return data.data.facilityType;
    })
    .catch((err) => {
      utils.api.handleError(err, { ...defaultError, message: 'API fetch error (processingInstructions.getFacilityTypes)' });
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(getFacilityTypesFailure(err));
      return err;
    })
    .finally(() => {
      dispatch(removeLoader('getFacilityTypes'));
    });
};

export const getFacilityTypesRequest = (payload) => {
  return {
    type: 'PROCESSING_INSTRUCTIONS_GET_FACILITY_TYPES_REQUEST',
    payload,
  };
};

export const getFacilityTypesSuccess = (responseData) => {
  return {
    type: 'PROCESSING_INSTRUCTIONS_GET_FACILITY_TYPES_SUCCESS',
    payload: responseData,
  };
};

export const getFacilityTypesFailure = (error) => {
  return {
    type: 'PROCESSING_INSTRUCTIONS_GET_FACILITY_TYPES_FAILURE',
    payload: error,
  };
};
