import { authLogout, addLoader, enqueueNotification, hideModal, removeLoader } from 'stores';
import * as utils from 'utils';

export const editStatus = (formData, claimID) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}} = getState();

  const defaultError = {
    file: 'stores/claims.actions.editStatus',
    message: 'Data missing for PUT request',
  };

  dispatch(editStatusRequest(formData));
  dispatch(addLoader('editStatus'));

  if (!formData) {
    dispatch(editStatusFailure(defaultError));
    dispatch(enqueueNotification('notification.lossInformation.fail', 'error'));
    dispatch(hideModal());
    dispatch(removeLoader('editStatus'));
    return;
  }

  return utils.api
    .put({
      token: auth.accessToken,
      endpoint: endpoint.claimService,
      path: `api/data/claims/${claimID}/status`,
      data: formData,
    })
    .then((data) => {
      dispatch(editStatusSuccess(formData, claimID));
      dispatch(enqueueNotification('notification.claimStatus.updatedSuccess', 'success'));
      dispatch(hideModal());
      dispatch(removeLoader('editStatus'));
      return data;
    })
    .catch((err) => {
      const errorParams = {
        ...defaultError,
        message: 'API fetch error',
      };

      utils.api.handleError(err, errorParams);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(editStatusFailure(err));
      dispatch(enqueueNotification('notification.claimStatus.fail', 'error'));
      dispatch(hideModal());
      dispatch(removeLoader('editStatus'));
      return err;
    });
};

export const editStatusRequest = (data) => {
  return {
    type: 'CLAIM_STATUS_EDIT_REQUEST',
    payload: data,
  };
};

export const editStatusSuccess = (data, id) => {
  return {
    type: 'CLAIM_STATUS_EDIT_SUCCESS',
    payload: {
      data,
      id,
    },
  };
};

export const editStatusFailure = (data) => {
  return {
    type: 'CLAIM_STATUS_EDIT_FAILURE',
    payload: data,
  };
};
