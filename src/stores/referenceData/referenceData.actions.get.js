import * as utils from 'utils';
import { authLogout } from 'stores';

export const getReferenceData = () => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}} = getState();

  dispatch(getReferenceDataRequest());

  return utils.api
    .get({
      token: auth.accessToken,
      endpoint: endpoint.edge,
      path: 'api/referenceData',
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleData(json))
    .then((data) => {
      dispatch(getReferenceDataSuccess(data));
    })
    .catch((err) => {
      const errorParams = {
        file: 'stores/referenceData.actions.get',
        message: 'API fetch error (referenceData.get)',
      };

      utils.api.handleError(err, errorParams);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(getReferenceDataFailure(err));
      return err;
    });
};

export const getReferenceDataRequest = () => {
  return {
    type: 'REFERENCE_DATA_GET_REQUEST',
  };
};

export const getReferenceDataSuccess = (data) => {
  return {
    type: 'REFERENCE_DATA_GET_SUCCESS',
    payload: data,
  };
};

export const getReferenceDataFailure = (error) => {
  return {
    type: 'REFERENCE_DATA_GET_FAILURE',
    payload: error,
  };
};
