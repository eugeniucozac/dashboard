// app
import { authLogout } from 'stores';
import * as utils from 'utils';
import { getFacilitiesFailure } from 'stores';

export const getAllFacilities = () => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint } } } = getState();

  const defaultError = {
    file: 'stores/risk.actions.getFacilities',
  };

  dispatch(getAllFacilitiesRequest());

  const path = `api/v1/facilities/all`;

  return utils.api
    .get({
      token: auth.accessToken,
      endpoint: endpoint.auth,
      path,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((data) => {
      dispatch(getAllFacilitiesSuccess(data));
    })
    .catch((err) => {
      utils.api.handleError(err, defaultError);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(getFacilitiesFailure(err));
      return err;
    });
};

export const getAllFacilitiesRequest = () => {
  return {
    type: 'RISK_ALL_FACILITIES_GET_REQUEST',
  };
};

export const getAllFacilitiesSuccess = (payload) => {
  return {
    type: 'RISK_ALL_FACILITIES_GET_SUCCESS',
    payload: {
      content: payload,
    },
  };
};
