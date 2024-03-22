import get from 'lodash/get';

// app
import { addLoader, authLogout, enqueueNotification, hideModal, removeLoader } from 'stores';
import * as utils from 'utils';

export const postPlacementAddPolicy = (formData) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}} = getState();

  const defaultError = {
    file: 'stores/placement.actions.addPolicy',
    message: 'Data missing for POST request',
  };

  dispatch(postPlacementAddPolicyRequest(formData));
  dispatch(addLoader('postPlacementAddPolicy'));

  if (!formData || !formData.businessType) {
    dispatch(postPlacementAddPolicyFailure(defaultError));
    dispatch(enqueueNotification('notification.addPolicy.fail', 'error'));
    dispatch(hideModal());
    dispatch(removeLoader('postPlacementAddPolicy'));
    return;
  }

  // get the data for POST
  const body = {
    parentPlacementId: get(getState(), 'placement.selected.id'),
    sourceSystemId: get(getState(), 'placement.selected.sourceSystemId'),
    departmentId: get(getState(), 'placement.selected.departmentId'),
    businessTypeId: get(formData, 'businessType[0].id'),
    isoCurrencyCode: get(formData, 'currency'),
    notes: formData.notes,
    amount: !formData.buydown ? parseFloat(formData.amount) : '',
    excess: !formData.buydown ? parseFloat(formData.excess) : '',
  };

  return utils.api
    .post({
      token: auth.accessToken,
      endpoint: endpoint.edge,
      path: 'api/policy',
      data: body,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleData(json))
    .then((data) => {
      dispatch(postPlacementAddPolicySuccess(data));
      dispatch(enqueueNotification('notification.addPolicy.success', 'success'));
      dispatch(hideModal());
      dispatch(removeLoader('postPlacementAddPolicy'));
    })
    .catch((err) => {
      const errorParams = {
        ...defaultError,
        message: 'API post error (placement.addPolicy)',
      };

      utils.api.handleError(err, errorParams);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(postPlacementAddPolicyFailure(err));
      dispatch(enqueueNotification('notification.addPolicy.fail', 'error'));
      dispatch(hideModal());
      dispatch(removeLoader('postPlacementAddPolicy'));
      return err;
    });
};

export const postPlacementAddPolicyRequest = (data) => {
  return {
    type: 'PLACEMENT_ADD_POLICY_POST_REQUEST',
    payload: data,
  };
};

export const postPlacementAddPolicySuccess = (data) => {
  return {
    type: 'PLACEMENT_POLICY_POST_SUCCESS',
    payload: data,
  };
};

export const postPlacementAddPolicyFailure = (error) => {
  return {
    type: 'PLACEMENT_ADD_POLICY_POST_FAILURE',
    payload: error,
  };
};
