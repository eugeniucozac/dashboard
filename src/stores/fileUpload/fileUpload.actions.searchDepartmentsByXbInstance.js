import * as utils from 'utils';
import { authLogout, getReferenceDataXbInstanceDepartments } from 'stores';

export const searchDepartmentsByXbInstance = (xbInstance) => (dispatch, getState) => {
  // prettier-ignore
  const { user: {auth}, config: { vars: { endpoint }}} = getState();

  const defaultError = {
    file: 'stores/fileUpload.actions.searchDepartmentsByXbInstance',
  };

  dispatch(searchDepartmentsByXbInstanceRequest(xbInstance));

  if (!xbInstance || !xbInstance.id) {
    dispatch(searchDepartmentsByXbInstanceFailure({ ...defaultError, message: 'Missing XB Instance ID param' }));
    return;
  }

  return utils.api
    .get({
      token: auth.accessToken,
      endpoint: endpoint.dmsService,
      path: `data/departments/${xbInstance.id}`,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleNewData(json))
    .then((json) => {
      dispatch(getReferenceDataXbInstanceDepartments(xbInstance.id, json.data));
      dispatch(searchDepartmentsByXbInstanceSuccess(xbInstance.id, json.data));
      return json.data;
    })
    .catch((err) => {
      utils.api.handleError(err, { ...defaultError, message: 'API fetch error (fileUpload.searchDepartmentsByXbInstance)' });
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(searchDepartmentsByXbInstanceFailure(err));
      return err;
    });
};

export const searchDepartmentsByXbInstanceRequest = (xbInstance) => {
  return {
    type: 'FILE_UPLOAD_SEARCH_DEPARTMENTS_BY_XBINSTANCE_REQUEST',
    payload: xbInstance,
  };
};

export const searchDepartmentsByXbInstanceSuccess = (xbInstanceId, responseData) => {
  return {
    type: 'FILE_UPLOAD_SEARCH_DEPARTMENTS_BY_XBINSTANCE_SUCCESS',
    payload: { id: xbInstanceId, departments: responseData },
  };
};

export const searchDepartmentsByXbInstanceFailure = (error) => {
  return {
    type: 'FILE_UPLOAD_SEARCH_DEPARTMENTS_BY_XBINSTANCE_FAILURE',
    payload: error,
  };
};
