import * as utils from 'utils';
import { authLogout, addLoader, removeLoader } from 'stores';

export const getRfiResolutionCodes = () => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}} = getState();

  dispatch(getRfiResolutionCodesRequest());
  dispatch(addLoader('getRfiResolutionCodes'));

  return utils.api
    .get({
      token: auth.accessToken,
      endpoint: endpoint.odsService,
      path: 'referenceData/RESOLUTIONCODE',
      params: { referenceDataType: 'RESOLUTIONCODE' },
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleNewData(json))
    .then((data) => {
      dispatch(getRfiResolutionCodesSuccess(data.data));
      return data;
    })
    .catch((err) => {
      const errorParams = {
        file: 'stores/premiumProcessing.actions.getRfiResolutionCode',
        message: 'API fetch error (premiumProcessing.getRfiResolutionCode)',
      };

      utils.api.handleError(err, errorParams);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(getRfiResolutionCodesFailure(err));
      return err;
    })
    .finally(() => {
      dispatch(removeLoader('getRfiResolutionCodes'));
    });
};

export const getRfiResolutionCodesRequest = () => {
  return {
    type: 'RFI_RESOLUTION_CODE_GET_REQUEST',
  };
};

export const getRfiResolutionCodesSuccess = (data) => {
  return {
    type: 'RFI_RESOLUTION_CODE_GET_SUCCESS',
    payload: data?.resolutionCode,
  };
};

export const getRfiResolutionCodesFailure = (error) => {
  return {
    type: 'RFI_RESOLUTION_CODE_GET_FAILURE',
    payload: error,
  };
};
