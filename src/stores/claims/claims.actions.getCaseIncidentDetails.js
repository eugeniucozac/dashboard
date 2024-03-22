import { authLogout, addLoader, removeLoader } from 'stores';
import * as utils from 'utils';

export const getCaseIncidentDetails =
  ({ processTypeId, referenceId, viewLoader = true, showError = true }) =>
  (dispatch, getState) => {
    // prettier-ignore
    const { user: { auth }, config: { vars: { endpoint }}} = getState();

    const defaultError = {
      file: 'stores/claims.actions.getCaseIncidentDetails',
    };

    dispatch(getCaseIncidentDetailsRequest());
    viewLoader && dispatch(addLoader('getCaseIncidentDetails'));

    return utils.api
      .get({
        token: auth.accessToken,
        endpoint: endpoint.bpmService,
        path: `/workflow/process/${processTypeId}/reference/${referenceId}/caseIncidentDetails`,
      })
      .then((response) => utils.api.handleResponse(response))
      .then((json) => utils.api.handleNewData(json, !showError))
      .then((data) => {
        dispatch(getCaseIncidentDetailsSuccess(data.data));
        return data.data;
      })
      .catch((err) => {
        dispatch(getCaseIncidentDetailsFailure(err, defaultError));
        utils.api.handleUnauthorized(err, dispatch, authLogout);
        return err;
      })
      .finally(() => {
        viewLoader && dispatch(removeLoader('getCaseIncidentDetails'));
      });
  };

export const getCaseIncidentDetailsRequest = (data) => {
  return {
    type: 'CLAIMS_CASE_INCIDENT_DETAILS_GET_REQUEST',
    payload: data,
  };
};

export const getCaseIncidentDetailsSuccess = (data) => {
  return {
    type: 'CLAIMS_CASE_INCIDENT_DETAILS_GET_SUCCESS',
    payload: data,
  };
};

export const getCaseIncidentDetailsFailure = (err) => {
  return {
    type: 'CLAIMS_CASE_INCIDENT_DETAILS_GET_FAILURE',
    payload: err,
  };
};
