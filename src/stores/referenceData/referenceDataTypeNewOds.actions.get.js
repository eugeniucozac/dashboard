import * as utils from 'utils';
import { authLogout } from 'stores';

export const getNewOdsReferenceTypes = () => (dispatch, getState) => {
  const {
    user: { auth },
    config: {
      vars: { endpoint },
    },
  } = getState();
  dispatch(getNewOdsReferenceTypesRequest());
  return utils.api
    .get({
      token: auth.accessToken,
      endpoint: endpoint.odsService,
      path: `referenceData/ResolutionCode,querycode`,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleNewData(json))
    .then((data) => {
      if (data && data.status === utils.string.t('app.ok') && data.data) {
        dispatch(getNewOdsReferenceTypesSuccess(data.data));
      }
    })
    .catch((err) => {
      const errorParams = {
        file: 'stores/referenceData.actions.get',
        message: 'API fetch error (getNewOdsReferenceTypes.get)',
      };
      utils.api.handleError(err, errorParams);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(getNewOdsReferenceTypesFailure(err));
      return err;
    });
};
export const getNewOdsReferenceTypesRequest = () => {
  return {
    type: 'REFERENCE_DATA_TYPE_NEW_ODS_REQUEST',
  };
};
export const getNewOdsReferenceTypesSuccess = (data) => {
  return {
    type: 'REFERENCE_DATA_TYPE_NEW_ODS_SUCCESS',
    payload: data,
  };
};
export const getNewOdsReferenceTypesFailure = (error) => {
  return {
    type: 'REFERENCE_DATA_TYPE_NEW_ODS_FAILURE',
    payload: error,
  };
};
