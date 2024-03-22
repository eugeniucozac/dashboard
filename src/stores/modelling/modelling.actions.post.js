import toNumber from 'lodash/toNumber';
// app
import { authLogout, enqueueNotification, addLoader, removeLoader, hideModal, uploadDocument } from 'stores';
import * as utils from 'utils';
import * as constants from 'consts';

export const createModellingTask = (payload) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint } } } = getState();

  const defaultError = {
    file: 'stores/modelling.actions.post',
    message: 'Data missing for POST request',
  };

  dispatch(postModellingRequest(payload));
  dispatch(addLoader('createModelling'));

  if (!payload || typeof payload !== 'object') {
    dispatch(postModellingFailure(defaultError));
    dispatch(enqueueNotification('notification.modelling.postFail', 'error'));
    dispatch(hideModal());
    dispatch(removeLoader('createModelling'));
    return;
  }

  const insured = Array.isArray(payload.insured) ? payload.insured[0] : payload.insured;
  const provisionalInsured = insured?.__isNew__ ? { name: insured?.id } : null;
  const transformedPayload = {
    dueDate: payload.dueDate,
    notes: payload.notes,
    status: 'PENDING',
    insured: insured?.__isNew__
      ? null
      : {
          id: typeof insured === 'object' ? insured?.id : toNumber(insured),
        },
    provisionalInsured: provisionalInsured,
    type: payload.modellingType,
    modellingAttachmentTypes: payload.modellingAttachmentTypes,
  };

  return utils.api
    .post({
      token: auth.accessToken,
      endpoint: endpoint.edge,
      path: 'api/modelling',
      data: transformedPayload,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleData(json))
    .then((data) => {
      dispatch(postModellingSuccess(data));
      const documentObject = {
        folder: constants.FOLDER_MODELLING,
        file: payload.file,
      };
      if (payload.file && payload.file.length > 0) {
        return dispatch(
          uploadDocument({
            data: documentObject,
            documentType: constants.FOLDER_MODELLING,
            documentTypeId: data?.id,
          })
        );
      }
    })
    .then(() => {
      dispatch(enqueueNotification('notification.modelling.postSuccess', 'success'));
      dispatch(hideModal());
    })
    .catch((err) => {
      const errorParams = {
        ...defaultError,
        message: 'API post error (modelling)',
      };
      utils.api.handleError(err, errorParams);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(postModellingFailure(err));
      dispatch(enqueueNotification('notification.modelling.postFail', 'error'));
      dispatch(hideModal());
      return err;
    })
    .finally(() => {
      dispatch(removeLoader('createModelling'));
    });
};

export const postModellingRequest = (payload) => {
  return {
    type: 'MODELLING_POST_REQUEST',
    payload,
  };
};

export const postModellingSuccess = (payload) => {
  return {
    type: 'MODELLING_POST_SUCCESS',
    payload,
  };
};

export const postModellingFailure = (error) => {
  return {
    type: 'MODELLING_POST_FAILURE',
    payload: error,
  };
};
