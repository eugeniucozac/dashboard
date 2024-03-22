import { addLoader, authLogout, removeLoader } from 'stores';
import * as utils from 'utils';

export const getPriorityLevels =
  (params = {}) =>
  (dispatch, getState) => {
    // prettier-ignore
    const { user: { auth }, config: { vars: { endpoint } } } = getState();

    const defaultError = {
      file: 'stores/claims.actions.getPriorityLevels',
    };
    const viewLoader = params?.viewLoader ?? true;

    dispatch(getPriorityLevelCodesRequest());
    viewLoader && dispatch(addLoader('getPriorityLevels'));

    return utils.api
      .get({
        token: auth.accessToken,
        endpoint: endpoint.claimService,
        path: 'api/data/gui/claims/priorities',
      })
      .then((response) => utils.api.handleResponse(response))
      .then((json) => utils.api.handleNewData(json))
      .then((data) => {
        dispatch(getPriorityLevelCodesSuccess(data.data));
        return data.data;
      })
      .catch((err) => {
        dispatch(getPriorityLevelCodesFailure(err, defaultError));
        utils.api.handleUnauthorized(err, dispatch, authLogout);
        return err;
      })
      .finally(() => {
        viewLoader && dispatch(removeLoader('getPriorityLevels'));
      });
  };

export const getPriorityLevelCodesRequest = () => {
  return {
    type: 'CLAIMS_PRIORITY_LEVELS_GET_REQUEST',
  };
};

export const getPriorityLevelCodesSuccess = (data) => {
  return {
    type: 'CLAIMS_PRIORITY_LEVELS_GET_SUCCESS',
    payload: data,
  };
};

export const getPriorityLevelCodesFailure = (err) => {
  return {
    type: 'CLAIMS_PRIORITY_LEVELS_GET_FAILURE',
    payload: err,
  };
};
