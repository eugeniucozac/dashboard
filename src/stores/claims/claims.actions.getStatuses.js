import { authLogout, addLoader, removeLoader } from 'stores';
import * as utils from 'utils';

export const getStatuses = () => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}} = getState();

  const defaultError = {
    file: 'stores/claims.actions.getStatuses',
  };

  dispatch(getStatusesRequest());
  dispatch(addLoader('getStatuses'));

  return utils.api
    .get({
      token: auth.accessToken,
      endpoint: endpoint.claimService,
      path: 'api/data/gui/claims/status',
    })
    .then((response) => utils.api.handleResponse(response))
    .then((data) => {
      dispatch(getStatusesSuccess(data.data));
      dispatch(removeLoader('getStatuses'));
      return data.data;
    })
    .catch((err) => {
      dispatch(getStatusesFailure(err, defaultError));
      dispatch(removeLoader('getStatuses'));
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      return err;
    });
};

export const getStatusesRequest = (data) => {
  return {
    type: 'CLAIMS_STATUSES_GET_REQUEST',
    payload: data,
  };
};

export const getStatusesSuccess = (data) => {
  return {
    type: 'CLAIMS_STATUSES_GET_SUCCESS',
    payload: data,
  };
};

export const getStatusesFailure = (data) => {
  return {
    type: 'CLAIMS_STATUSES_GET_FAILURE',
    payload: data,
  };
};
