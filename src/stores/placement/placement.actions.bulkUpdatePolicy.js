import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';

// app
import {
  addLoader,
  authLogout,
  bulkPlacementClear,
  deletePlacementPolicies,
  deletePlacementPolicyMarkets,
  enqueueNotification,
  hideModal,
  removeLoader,
  updateSelectedPolicyMarket,
  updatePlacementPolicyMarkets,
} from 'stores';
import * as utils from 'utils';

export const postPlacementBulkPolicy = (formData) => (dispatch, getState) => {
  const bulkType = get(getState(), 'placement.bulk.type');
  const bulkItems = get(getState(), 'placement.bulk.items', []);

  const defaultError = {
    file: 'stores/placement.actions.bulkPolicy',
    message: 'Data missing for POST request',
  };

  if (!formData || !bulkType || isEmpty(bulkItems)) {
    dispatch(postPlacementBulkPolicyUpdateFailure(defaultError));
    dispatch(enqueueNotification('notification.bulkEdit.fail', 'error'));
    dispatch(hideModal());
    return;
  }

  if (bulkType === 'policy') {
    return dispatch(postPlacementBulkPolicyUpdate(formData));
  } else {
    return dispatch(postPlacementBulkPolicyUpdateMarket(formData));
  }
};

export const postPlacementBulkPolicyUpdate = (formData) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}} = getState();

  const action = formData.delete ? 'delete' : 'edit';
  const body = get(getState(), 'placement.bulk.items', []);

  dispatch(postPlacementBulkPolicyUpdateRequest(formData));
  dispatch(addLoader('postPlacementBulkPolicyUpdate'));

  return utils.api
    .post({
      token: auth.accessToken,
      endpoint: endpoint.edge,
      path: `api/policy/bulk/${action}`,
      data: body,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleData(json))
    .then((data) => {
      dispatch(postPlacementBulkPolicyUpdateSuccess(data));

      // on POST success update the UI
      if (formData.delete) {
        dispatch(deletePlacementPolicies(body));
      }

      dispatch(enqueueNotification('notification.bulkEdit.success', 'success'));
      dispatch(bulkPlacementClear());
      dispatch(hideModal());
      dispatch(removeLoader('postPlacementBulkPolicyUpdate'));
    })
    .catch((err) => {
      const errorParams = {
        file: 'stores/placement.actions.bulk',
        message: 'API post error (placement.bulk)',
      };

      utils.api.handleError(err, errorParams);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(postPlacementBulkPolicyUpdateFailure(err));
      dispatch(enqueueNotification('notification.bulkEdit.fail', 'error'));
      dispatch(hideModal());
      dispatch(removeLoader('postPlacementBulkPolicyUpdate'));
      return err;
    });
};

export const postPlacementBulkPolicyUpdateMarket = (formData) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}} = getState();

  const action = formData.delete ? 'delete' : 'edit';
  const bulkItems = get(getState(), 'placement.bulk.items', []);

  const body = bulkItems.map((marketId) => {
    const currentMarket = utils.policies.getMarketById(get(getState(), 'placement.selected.policies', []), marketId);

    if (action === 'delete') {
      return marketId;
    }

    return {
      ...currentMarket,
      statusId: formData.status ? parseFloat(formData.status) : currentMarket.statusId,
      premium: formData.premium ? parseFloat(formData.premium) : currentMarket.premium,
    };
  });

  dispatch(postPlacementBulkPolicyUpdateRequest(formData));
  dispatch(addLoader('postPlacementBulkMarket'));

  return utils.api
    .post({
      token: auth.accessToken,
      endpoint: endpoint.edge,
      path: `api/policy/market/bulk/${action}`,
      data: body,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleData(json))
    .then((data) => {
      dispatch(postPlacementBulkPolicyUpdateSuccess(data));

      // on POST success -> update the store
      // in this case, we don't expect the updated data to be returned from the API
      // so we take the data sent (body) and do an "optimistic update" on the UI
      if (formData.delete) {
        dispatch(deletePlacementPolicyMarkets(body));
      } else {
        dispatch(updatePlacementPolicyMarkets(body));
      }

      dispatch(updateSelectedPolicyMarket());
      dispatch(enqueueNotification('notification.bulkEdit.success', 'success'));
      dispatch(bulkPlacementClear());
      dispatch(hideModal());
      dispatch(removeLoader('postPlacementBulkMarket'));
    })
    .catch((err) => {
      const errorParams = {
        file: 'stores/placement.actions.bulk',
        message: 'API post error (placement.bulk)',
      };

      utils.api.handleError(err, errorParams);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(postPlacementBulkPolicyUpdateFailure(err));
      dispatch(enqueueNotification('notification.bulkEdit.fail', 'error'));
      dispatch(hideModal());
      dispatch(removeLoader('postPlacementBulkMarket'));
      return err;
    });
};

export const postPlacementBulkPolicyUpdateRequest = (data) => {
  return {
    type: 'PLACEMENT_BULK_POLICY_POST_REQUEST',
    payload: data,
  };
};

export const postPlacementBulkPolicyUpdateSuccess = (data) => {
  return {
    type: 'PLACEMENT_BULK_POLICY_POST_SUCCESS',
    payload: data,
  };
};

export const postPlacementBulkPolicyUpdateFailure = (error) => {
  return {
    type: 'PLACEMENT_BULK_POLICY_POST_FAILURE',
    payload: error,
  };
};
