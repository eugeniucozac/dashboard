import * as utils from 'utils';
import { authLogout } from 'stores';

export const getReferenceDataNew = () => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}} = getState();

  dispatch(getReferenceDataNewRequest());

  return utils.api
    .get({
      token: auth.accessToken,
      endpoint: endpoint.odsService,
      path: 'referenceData/all',
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => {
      if (json && json.status === 'OK' && json.data) {
        dispatch(getReferenceDataNewSuccess(json.data));
      }
    })
    .catch((err) => {
      const errorParams = {
        file: 'stores/referenceData.actions.get',
        message: 'API fetch error (referenceDataAll.get)',
      };

      utils.api.handleError(err, errorParams);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(getReferenceDataNewFailure(err));
      return err;
    });
};

export const getReferenceDataNewRequest = () => {
  return {
    type: 'REFERENCE_DATA_GET_NEW_REQUEST',
  };
};

export const getReferenceDataNewSuccess = (data) => {
  return {
    type: 'REFERENCE_DATA_GET_NEW_SUCCESS',
    payload: data,
  };
};

export const getReferenceDataNewFailure = (error) => {
  return {
    type: 'REFERENCE_DATA_GET_NEW_FAILURE',
    payload: error,
  };
};
