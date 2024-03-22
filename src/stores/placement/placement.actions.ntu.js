import get from 'lodash/get';

// app
import { addLoader, authLogout, enqueueNotification, hideModal, removeLoader } from 'stores';
import * as utils from 'utils';
import * as constants from 'consts';

export const ntuPlacement =
  (placement, calendarView = false) =>
  (dispatch, getState) => {
    // prettier-ignore
    const { user: { auth }, config: { vars: { endpoint }}} = getState();

    const defaultError = {
      file: 'stores/placement.actions.ntu',
      message: 'Data missing for PATCH request',
    };

    const state = getState();
    const statusPlacement = get(state, 'referenceData.statuses.placement', []);
    const statusPlacementNtuId = utils.referenceData.status.getIdByCode(statusPlacement, constants.STATUS_PLACEMENT_NTU);
    const statusNtu = statusPlacement.find((status) => status.id === statusPlacementNtuId);

    dispatch(ntuPlacementRequest(placement));
    dispatch(addLoader('ntuPlacement'));

    if (!placement || !placement.id || !statusNtu) {
      dispatch(ntuPlacementFailure(defaultError));
      dispatch(enqueueNotification('notification.ntuPlacement.fail', 'error'));
      dispatch(removeLoader('ntuPlacement'));
      return;
    }

    return utils.api
      .patch({
        token: auth.accessToken,
        endpoint: endpoint.edge,
        path: `api/placement/${placement.id}`,
        data: {
          statusId: get(statusNtu, 'id'),
        },
      })
      .then((response) => utils.api.handleResponse(response))
      .then((json) => utils.api.handleData(json))
      .then((data) => {
        dispatch(ntuPlacementSuccess(data, calendarView));
        dispatch(enqueueNotification('notification.ntuPlacement.success', 'success'));
        dispatch(removeLoader('ntuPlacement'));
      })
      .catch((err) => {
        const errorParams = {
          ...defaultError,
          message: 'API patch error (placement.ntu)',
        };

        utils.api.handleError(err, errorParams);
        utils.api.handleUnauthorized(err, dispatch, authLogout);
        dispatch(ntuPlacementFailure(err));
        dispatch(enqueueNotification('notification.ntuPlacement.fail', 'error'));
        dispatch(hideModal());
        dispatch(removeLoader('ntuPlacement'));
        return err;
      });
  };

export const ntuPlacementRequest = (data) => {
  return {
    type: 'PLACEMENT_NTU_REQUEST',
    payload: data,
  };
};

export const ntuPlacementSuccess = (data, calendarView) => {
  return {
    type: calendarView ? 'PLACEMENT_NTU_CALENDAR_SUCCESS' : 'PLACEMENT_NTU_SUCCESS',
    payload: data,
  };
};

export const ntuPlacementFailure = (error) => {
  return {
    type: 'PLACEMENT_NTU_FAILURE',
    payload: error,
  };
};
