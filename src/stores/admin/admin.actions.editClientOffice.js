import { addLoader, authLogout, removeLoader, enqueueNotification, hideModal } from 'stores';
import * as utils from 'utils';

export const editClientOffice = (editedOffice, previousOffice) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}} = getState();

  dispatch(editClientOfficeRequest(editedOffice));
  dispatch(addLoader('editClientOffice'));

  const defaultError = {
    file: 'stores/admin.actions.editClientOffice',
  };

  if (
    !utils.generic.isValidObject(editedOffice) ||
    !utils.generic.isValidArray(editedOffice.parent, true) ||
    !utils.generic.isValidArray(editedOffice.clients, true) ||
    !utils.generic.isValidObject(previousOffice)
  ) {
    dispatch(editClientOfficeFailure(defaultError));
    dispatch(enqueueNotification('notification.admin.officePatchFail', 'error'));
    dispatch(removeLoader('editClientOffice'));
    dispatch(hideModal());
    return;
  }

  const { parent, name, clients } = editedOffice;

  const officeToIds = {
    name,
    clientIds: clients.map((client) => client.id),
    parentId: parent[0].id,
  };

  const previousOfficeToIds = {
    name: previousOffice.name,
    parentId: previousOffice.parent && previousOffice.parent.id,
    clientIds: utils.generic.isValidArray(previousOffice.clients) && previousOffice.clients.map((clients) => clients.id),
  };

  const patchChanges = utils.generic.getDifferences(previousOfficeToIds, officeToIds);

  return utils.api
    .patch({
      token: auth.accessToken,
      endpoint: endpoint.edge,
      path: `api/client/office/${previousOffice.id}`,
      data: patchChanges,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleData(json))
    .then((data) => {
      const { name, parent } = data;
      dispatch(editClientOfficeSuccess(data));
      dispatch(
        enqueueNotification('notification.admin.officePatchSuccess', 'success', {
          data: { officeName: name, clientName: parent && parent.name },
        })
      );
    })
    .catch((err) => {
      utils.api.handleError(err, defaultError);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(editClientOfficeFailure(err));
      dispatch(enqueueNotification('notification.admin.officePatchFail', 'error'));
      return err;
    })
    .finally(() => {
      dispatch(removeLoader('editClientOffice'));
      dispatch(hideModal());
    });
};

export const editClientOfficeRequest = (payload) => {
  return {
    type: 'ADMIN_CLIENT_OFFICE_EDIT_REQUEST',
    payload,
  };
};

export const editClientOfficeSuccess = (payload) => {
  return {
    type: 'ADMIN_CLIENT_OFFICE_EDIT_SUCCESS',
    payload,
  };
};

export const editClientOfficeFailure = (error) => {
  return {
    type: 'ADMIN_CLIENT_OFFICE_EDIT_FAILURE',
    payload: error,
  };
};
