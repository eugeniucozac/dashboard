import omit from 'lodash/omit';
import uniqBy from 'lodash/uniqBy';
import get from 'lodash/get';

// app
import * as utils from 'utils';
import { authLogout, addLoader, enqueueNotification, hideModal, removeLoader } from 'stores';

export const postEditPlacement =
  (formData, calendarView = false) =>
  (dispatch, getState) => {
    // prettier-ignore
    const { user: { auth }, config: { vars: { endpoint }}} = getState();
    const placement_id = formData.placementId;

    const defaultError = {
      file: 'stores/placement.actions.editPlacement',
      message: 'Data missing for PUT request',
    };
    dispatch(postEditPlacementRequest(formData));
    dispatch(addLoader('postEditPlacement'));

    if (!formData || !formData.placementId) {
      dispatch(postEditPlacementFailure(defaultError));
      dispatch(enqueueNotification('notification.editPlacement.fail', 'error'));
      dispatch(hideModal());
      dispatch(removeLoader('postEditPlacement'));
      return;
    }

    const usersAll = uniqBy([...formData.brokers, ...formData.cobrokers], 'id').map((broker) => omit(broker, 'label'));

    // get the data for PUT
    const body = {
      users: usersAll,
      departmentId: get(formData, 'department'),
      clients: get(formData, 'clients', []).map((client) => ({ id: client.id })),
      insureds: get(formData, 'insureds', [])
        .filter((insured) => !Boolean(insured.__isNew__))
        .map((insured) => ({ id: insured.id })),
      provisionalInsureds: get(formData, 'insureds', [])
        .filter((insured) => Boolean(insured.__isNew__))
        .map((insured) => ({ name: insured.id })),
      statusId: get(formData, 'statusLabel'),
      inceptionDate: formData.inceptionDate,
      description: formData.description,
    };

    return utils.api
      .put({
        token: auth.accessToken,
        endpoint: endpoint.edge,
        path: `api/placement/${placement_id}`,
        data: body,
      })
      .then((response) => utils.api.handleResponse(response))
      .then((json) => utils.api.handleData(json))
      .then((data) => {
        dispatch(postEditPlacementSuccess(data, calendarView));
        dispatch(enqueueNotification('notification.editPlacement.success', 'success'));
        dispatch(hideModal());
        dispatch(removeLoader('postEditPlacement'));
        return data;
      })
      .catch((err) => {
        const errorParams = {
          ...defaultError,
          message: 'API fetch error (placement.postEditPlacement)',
        };

        utils.api.handleError(err, errorParams);
        utils.api.handleUnauthorized(err, dispatch, authLogout);
        dispatch(postEditPlacementFailure(err));
        dispatch(enqueueNotification('notification.editPlacement.fail', 'error'));
        dispatch(hideModal());
        dispatch(removeLoader('postEditPlacement'));
        return err;
      });
  };

export const postEditPlacementRequest = (data) => {
  return {
    type: 'PLACEMENT_EDIT_POST_REQUEST',
    payload: data,
  };
};

export const postEditPlacementSuccess = (data, calendarView) => {
  return {
    type: calendarView ? 'PLACEMENT_POST_CALENDAR_SUCCESS' : 'PLACEMENT_POST_SUCCESS',
    payload: data,
  };
};

export const postEditPlacementFailure = (error) => {
  return {
    type: 'PLACEMENT_EDIT_POST_FAILURE',
    payload: error,
  };
};
