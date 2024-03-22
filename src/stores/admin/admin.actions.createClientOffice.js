import { addLoader, authLogout, removeLoader, enqueueNotification, hideModal } from 'stores';
import * as utils from 'utils';

export const createClientOffice = (newClientOffice) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}} = getState();

  dispatch(createClientOfficeRequest(newClientOffice));
  dispatch(addLoader('createClientOffice'));

  const defaultError = {
    file: 'stores/admin.actions.createClientOffice',
  };

  if (
    !utils.generic.isValidObject(newClientOffice) ||
    !utils.generic.isValidArray(newClientOffice.clients, true) ||
    !utils.generic.isValidArray(newClientOffice.parent, true)
  ) {
    dispatch(createClientOfficeFailure(defaultError));
    dispatch(enqueueNotification('notification.admin.officePostFail', 'error'));
    dispatch(removeLoader('createClientOffice'));
    dispatch(hideModal());
    return;
  }

  const { parent, name, clients } = newClientOffice;

  const data = {
    name,
    clientIds: clients.map((client) => client.id),
    parentId: parent[0].id,
  };

  return utils.api
    .post({
      token: auth.accessToken,
      endpoint: endpoint.edge,
      path: 'api/client/office',
      data,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleData(json))
    .then((data) => {
      const { name, parent } = data;
      dispatch(createClientOfficeSuccess(data));
      dispatch(
        enqueueNotification('notification.admin.officePostSuccess', 'success', {
          data: { officeName: name, clientName: parent && parent.name },
        })
      );
    })
    .catch((err) => {
      utils.api.handleError(err, defaultError);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(createClientOfficeFailure(err));
      dispatch(enqueueNotification('notification.admin.officePostFail', 'error'));
      return err;
    })
    .finally(() => {
      dispatch(removeLoader('createClientOffice'));
      dispatch(hideModal());
    });
};

export const createClientOfficeRequest = (payload) => {
  return {
    type: 'ADMIN_CLIENT_OFFICE_CREATE_REQUEST',
    payload,
  };
};

export const createClientOfficeSuccess = (payload) => {
  return {
    type: 'ADMIN_CLIENT_OFFICE_CREATE_SUCCESS',
    payload,
  };
};

export const createClientOfficeFailure = (error) => {
  return {
    type: 'ADMIN_CLIENT_OFFICE_CREATE_FAILURE',
    payload: error,
  };
};
