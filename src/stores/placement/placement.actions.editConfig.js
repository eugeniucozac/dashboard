// app
import { authLogout, enqueueNotification } from 'stores';
import * as utils from 'utils';
import has from 'lodash/has';

export const editPlacementConfig = (data) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}, placement: { selected = {} }} = getState();

  const defaultError = {
    file: 'stores/placement.actions.editPlacementConfig',
    message: 'Data missing for PATCH request',
  };

  dispatch(editPlacementConfigRequest(data));

  if (!data || !selected.id || (!has(data, 'mudmap') && !has(data, 'capacity') && !has(data, 'visibleToCobrokers'))) {
    dispatch(editPlacementConfigFailure(defaultError));
    dispatch(enqueueNotification('notification.editPlacementConfig.fail', 'error'));
    return;
  }

  const body = {
    config: JSON.stringify({
      ...(selected.config || {}),
      ...(has(data, 'mudmap') ? { mudmap: data.mudmap } : {}),
      ...(has(data, 'capacity') ? { capacity: data.capacity } : {}),
      ...(has(data, 'visibleToCobrokers') ? { visibleToCobrokers: data.visibleToCobrokers } : {}),
    }),
  };

  return utils.api
    .patch({
      token: auth.accessToken,
      endpoint: endpoint.edge,
      path: `api/placement/${selected.id}`,
      data: body,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleData(json))
    .then((data) => {
      dispatch(editPlacementConfigSuccess(data));
    })
    .catch((err) => {
      const errorParams = {
        ...defaultError,
        message: 'API patch error (placement.editPlacementConfig)',
      };

      utils.api.handleError(err, errorParams);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(editPlacementConfigFailure(err));
      dispatch(enqueueNotification('notification.editPlacementConfig.fail', 'error'));
      return err;
    });
};

export const editPlacementConfigRequest = (data) => {
  return {
    type: 'PLACEMENT_EDIT_CONFIG_REQUEST',
    payload: data,
  };
};

export const editPlacementConfigSuccess = (data) => {
  return {
    type: 'PLACEMENT_EDIT_CONFIG_SUCCESS',
    payload: data,
  };
};

export const editPlacementConfigFailure = (error) => {
  return {
    type: 'PLACEMENT_EDIT_CONFIG_FAILURE',
    payload: error,
  };
};
