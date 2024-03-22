import toNumber from 'lodash/toNumber';

// app
import { authLogout, enqueueNotification, addLoader, removeLoader, hideModal } from 'stores';
import * as utils from 'utils';

export const updateModellingTask = (payload) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}} = getState();

  const modellingId = payload.id;

  const defaultError = {
    file: 'stores/modelling.actions.put',
    message: 'Data missing for PUT request',
  };

  dispatch(putModellingRequest(payload));
  dispatch(addLoader('createModelling'));

  if (!payload || typeof payload !== 'object' || !modellingId) {
    dispatch(putModellingFailure(defaultError));
    dispatch(enqueueNotification('notification.modelling.putFail', 'error'));
    dispatch(hideModal());
    dispatch(removeLoader('createModelling'));
    return;
  }
  const insured = Array.isArray(payload.insured) ? payload.insured[0] : payload.insured;
  const provisionalInsured = insured?.__isNew__ ? { name: insured?.id } : null;
  const transformedPayload = {
    dueDate: payload.dueDate || '',
    notes: payload.notes || '',
    status: payload.status || '',
    insured: insured?.__isNew__
      ? null
      : {
          id: typeof insured === 'object' ? insured?.id : toNumber(insured),
        },
    provisionalInsured: provisionalInsured,
    type: payload.modellingType || '',
    modellingAttachmentTypes: payload.modellingAttachmentTypes || [],
  };

  return utils.api
    .put({
      token: auth.accessToken,
      endpoint: endpoint.edge,
      path: `api/modelling/${modellingId}`,
      data: transformedPayload,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleData(json))
    .then((data) => {
      dispatch(putModellingSuccess(data));
      dispatch(enqueueNotification('notification.modelling.putSuccess', 'success'));
    })
    .catch((err) => {
      const errorParams = {
        ...defaultError,
        message: 'API put error (modelling)',
      };

      utils.api.handleError(err, errorParams);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(putModellingFailure(err));
      dispatch(enqueueNotification('notification.modelling.putFail', 'error'));
      return err;
    })
    .finally(() => {
      dispatch(hideModal());
      dispatch(removeLoader('createModelling'));
    });
};

export const putModellingRequest = (payload) => {
  return {
    type: 'MODELLING_PUT_REQUEST',
    payload,
  };
};

export const putModellingSuccess = (payload) => {
  return {
    type: 'MODELLING_PUT_SUCCESS',
    payload,
  };
};

export const putModellingFailure = (error) => {
  return {
    type: 'MODELLING_PUT_FAILURE',
    payload: error,
  };
};
