import get from 'lodash/get';
import has from 'lodash/has';

// app
import { addLoader, authLogout, enqueueNotification, hideModal, removeLoader } from 'stores';
import * as utils from 'utils';

export const putPlacementEditPolicy = (formData) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}} = getState();

  const policies = get(getState(), 'placement.selected.policies', []);
  const policy_id = formData.id;
  const policy = utils.policies.getById(policies, policy_id);

  const defaultError = {
    file: 'stores/placement.actions.editPolicy',
    message: 'Data missing for PUT request',
  };

  dispatch(putPlacementEditPolicyRequest(formData));
  dispatch(addLoader('putPlacementEditPolicy'));

  if (!formData || !formData.id || !formData.departmentId || !formData.businessTypeId) {
    dispatch(putPlacementEditPolicyFailure(defaultError));
    dispatch(enqueueNotification('notification.editPolicy.fail', 'error'));
    dispatch(hideModal());
    dispatch(removeLoader('putPlacementEditPolicy'));
    return;
  }

  // get the data for PUT
  const body = {
    parentPlacementId: get(getState(), 'placement.selected.id'),
    sourceSystemId: get(getState(), 'placement.selected.sourceSystemId'),
    departmentId: get(formData, 'departmentId'),
    businessTypeId: get(formData, 'businessTypeId'),
    isoCurrencyCode: has(formData, 'currency') ? formData.currency : policy.isoCurrencyCode,
    statusId: has(formData, 'status') ? (formData.status === 'null' || formData.status === '' ? null : formData.status) : policy.statusId,
    notes: has(formData, 'notes') ? formData.notes : policy.notes,
    amount: formData.buydown ? '' : parseFloat(has(formData, 'amount') ? formData.amount : policy.amount),
    excess: formData.buydown ? '' : parseFloat(has(formData, 'excess') ? formData.excess : policy.excess),
  };

  return utils.api
    .put({
      token: auth.accessToken,
      endpoint: endpoint.edge,
      path: `api/policy/${formData.id}`,
      data: body,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleData(json))
    .then((data) => {
      dispatch(putPlacementEditPolicySuccess(data));
      dispatch(enqueueNotification('notification.editPolicy.success', 'success'));
      dispatch(hideModal());
      dispatch(removeLoader('putPlacementEditPolicy'));
    })
    .catch((err) => {
      const errorParams = {
        ...defaultError,
        message: 'API put error (placement.editPolicy)',
      };

      utils.api.handleError(err, errorParams);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(putPlacementEditPolicyFailure(err));
      dispatch(enqueueNotification('notification.editPolicy.fail', 'error'));
      dispatch(hideModal());
      dispatch(removeLoader('putPlacementEditPolicy'));
      return err;
    });
};

export const putPlacementEditPolicyRequest = (data) => {
  return {
    type: 'PLACEMENT_EDIT_POLICY_PUT_REQUEST',
    payload: data,
  };
};

export const putPlacementEditPolicySuccess = (data) => {
  return {
    type: 'PLACEMENT_POLICY_PUT_SUCCESS',
    payload: data,
  };
};

export const putPlacementEditPolicyFailure = (error) => {
  return {
    type: 'PLACEMENT_EDIT_POLICY_PUT_FAILURE',
    payload: error,
  };
};
