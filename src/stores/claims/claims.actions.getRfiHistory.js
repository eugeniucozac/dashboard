import { addLoader, authLogout, removeLoader } from 'stores';
import * as utils from 'utils';

export const getRfiHistory =
  (bpmTaskID, viewLoader = false) =>
  (dispatch, getState) => {
    // prettier-ignore
    const { user: { auth }, config: { vars: { endpoint } } } = getState();

    const defaultError = {
      file: 'stores/claims.actions.getRfiHistory',
    };

    dispatch(getRfiHistoryRequest(bpmTaskID));
    viewLoader && dispatch(addLoader('getRfiHistory'));

    if (!bpmTaskID) {
      dispatch(getRfiHistoryFailure({ ...defaultError, message: 'Missing requests params' }));
      viewLoader && dispatch(removeLoader('getRfiHistory'));
      return;
    }

    return utils.api
      .get({
        token: auth.accessToken,
        endpoint: endpoint.bpmService,
        path: `api/workflow/process/${bpmTaskID}/rfi-history`,
      })
      .then((response) => utils.api.handleResponse(response))
      .then((json) => utils.api.handleNewData(json))
      .then((data) => {
        dispatch(getRfiHistorySuccess(data.data));
        return data;
      })
      .catch((error) => {
        dispatch(getRfiHistoryFailure(error, defaultError));
        utils.api.handleUnauthorized(error, dispatch, authLogout);
        return error;
      })
      .finally(() => {
        viewLoader && dispatch(removeLoader('getRfiHistory'));
      });
  };

export const getRfiHistoryRequest = (bpmTaskID) => {
  return {
    type: 'CLAIMS_GET_RFI_HISTORY_REQUEST',
    payload: { bpmTaskID },
  };
};

export const getRfiHistorySuccess = (data) => {
  return {
    type: 'CLAIMS_GET_RFI_HISTORY_SUCCESS',
    payload: data,
  };
};

export const getRfiHistoryFailure = (error) => {
  return {
    type: 'CLAIMS_GET_RFI_HISTORY_FAILURE',
    payload: error,
  };
};
