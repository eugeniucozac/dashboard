// app
import * as utils from 'utils';
import { authLogout, addLoader, enqueueNotification, hideModal, removeLoader } from 'stores';

export const removePlacement =
  (formData, calendarView = false) =>
  (dispatch, getState) => {
    // prettier-ignore
    const { user: { auth }, config: { vars: { endpoint }}} = getState();

    const defaultError = {
      file: 'stores/placement.actions.removePlacement',
      message: 'Data missing for PATCH request',
    };

    dispatch(removePlacementRequest(formData));
    dispatch(addLoader('removePlacement'));

    if (!formData || !formData.id) {
      dispatch(removePlacementFailure(defaultError));
      dispatch(enqueueNotification('notification.removePlacement.fail', 'error'));
      dispatch(hideModal());
      dispatch(removeLoader('removePlacement'));
      return;
    }

    const placement_id = formData.id;

    // get the data for PATCH
    const body = {
      isHidden: true,
    };

    return utils.api
      .patch({
        token: auth.accessToken,
        endpoint: endpoint.edge,
        path: `api/placement/${placement_id}`,
        data: body,
      })
      .then((response) => utils.api.handleResponse(response))
      .then((json) => utils.api.handleData(json))
      .then((data) => {
        dispatch(removePlacementSuccess(data, calendarView));
        dispatch(enqueueNotification('notification.removePlacement.success', 'success'));
        dispatch(hideModal());
        dispatch(removeLoader('removePlacement'));
        return data;
      })
      .catch((err) => {
        const errorParams = {
          ...defaultError,
          message: 'API fetch error (placement.removePlacement)',
        };

        utils.api.handleError(err, errorParams);
        utils.api.handleUnauthorized(err, dispatch, authLogout);
        dispatch(removePlacementFailure(err));
        dispatch(enqueueNotification('notification.removePlacement.fail', 'error'));
        dispatch(hideModal());
        dispatch(removeLoader('removePlacement'));
        return err;
      });
  };

export const removePlacementRequest = (data) => {
  return {
    type: 'PLACEMENT_REMOVE_PATCH_REQUEST',
    payload: data,
  };
};

export const removePlacementSuccess = (data, calendarView) => {
  return {
    type: calendarView ? 'PLACEMENT_REMOVE_PATCH_CALENDAR_SUCCESS' : 'PLACEMENT_REMOVE_PATCH_SUCCESS',
    payload: data,
  };
};

export const removePlacementFailure = (error) => {
  return {
    type: 'PLACEMENT_REMOVE_PATCH_FAILURE',
    payload: error,
  };
};
