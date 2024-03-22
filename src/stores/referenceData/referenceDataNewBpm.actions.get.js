import * as utils from 'utils';
import { authLogout } from 'stores';

export const getReferenceDataNewBpm = () => (dispatch, getState) => {
  const {
    user: { auth },
    config: {
      vars: { endpoint },
    },
  } = getState();
  dispatch(getReferenceDataNewBpmRequest());
  return utils.api
    .get({
      token: auth.accessToken,
      endpoint: endpoint.bpmService,
      path: 'referenceData/bpmFlag,bpmStage',
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleNewData(json))
    .then((data) => {
      if (data && data.status === utils.string.t('app.ok') && data.data) {
        dispatch(getReferenceDataNewBpmSuccess(data.data));
      }
    })
    .catch((err) => {
      const errorParams = {
        file: 'stores/referenceDataNewBpmService.actions.get',
        message: 'API fetch error (referenceDataNewBpmService.get)',
      };
      utils.api.handleError(err, errorParams);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(getReferenceDataNewBpmFailure(err));
      return err;
    });
};
export const getReferenceDataNewBpmRequest = () => {
  return {
    type: 'REFERENCE_DATA_GET_NEW_BPM_REQUEST',
  };
};
export const getReferenceDataNewBpmSuccess = (data) => {
  return {
    type: 'REFERENCE_DATA_GET_NEW_BPM_SUCCESS',
    payload: data,
  };
};
export const getReferenceDataNewBpmFailure = (error) => {
  return {
    type: 'REFERENCE_DATA_GET_NEW_BPM_FAILURE',
    payload: error,
  };
};
