import { authLogout, addLoader, removeLoader } from 'stores';
import * as utils from 'utils';
import get from 'lodash/get';

export const getBEAdjuster = (params) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint } }, claims } = getState();
  const sourceID = get(claims, 'policyData.xbInstanceID') || '';
  const departmentID = get(claims, 'policyData.divisionID') || get(claims, 'policyInformation.divisionID') || '';

  const defaultError = {
    file: 'stores/claims.actions.getBEAdjuster',
  };
  const viewLoader = params?.viewLoader ?? false;
  dispatch(getBEAdjusterRequest());
  viewLoader && dispatch(addLoader('getBEAdjuster'));

  return utils.api
    .get({
      token: auth.accessToken,
      endpoint: endpoint.claimService,
      path: `api/data/gui/claims/${sourceID}/department/${departmentID}/be-adjuster`,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((data) => {
      dispatch(getBEAdjusterSuccess(data.data));
      viewLoader && dispatch(removeLoader('getBEAdjuster'));
      return data.data;
    })
    .catch((err) => {
      dispatch(getBEAdjusterFailure(err, defaultError));
      viewLoader && dispatch(removeLoader('getBEAdjuster'));
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      return err;
    });
};

export const getBEAdjusterRequest = (data) => {
  return {
    type: 'CLAIMS_BE_ADJUSTER_GET_REQUEST',
    payload: data,
  };
};

export const getBEAdjusterSuccess = (data) => {
  return {
    type: 'CLAIMS_BE_ADJUSTER_GET_SUCCESS',
    payload: data,
  };
};

export const getBEAdjusterFailure = (data) => {
  return {
    type: 'CLAIMS_BE_ADJUSTER_GET_FAILURE',
    payload: data,
  };
};

export const setBEAdjusterValue = (data) => {
  return {
    type: 'SET_CLAIMS_BE_ADJUSTER_VALUE',
    payload: data,
  };
};
