import { addLoader, authLogout, enqueueNotification, hideModal, removeLoader } from 'stores';
import * as utils from 'utils';

export const deleteDepartmentMarket = (deptMarketId) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}} = getState();

  const defaultError = {
    file: 'stores/department.actions.deleteMarket',
    message: 'Data missing for DELETE request',
  };

  dispatch(deleteDepartmentMarketRequest(deptMarketId));
  dispatch(addLoader('deleteDepartmentMarket'));

  if (!deptMarketId) {
    dispatch(deleteDepartmentMarketFailure(defaultError));
    dispatch(enqueueNotification('notification.deleteDepartmentMarket.fail', 'error'));
    dispatch(hideModal());
    dispatch(removeLoader('deleteDepartmentMarket'));
    return;
  }

  return utils.api
    .delete({
      token: auth.accessToken,
      endpoint: endpoint.edge,
      path: `api/departmentMarket/${deptMarketId}`,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleData(json, true))
    .then(() => {
      dispatch(deleteDepartmentMarketSuccess(deptMarketId));
      dispatch(enqueueNotification('notification.deleteDepartmentMarket.success', 'success'));
      dispatch(hideModal());
      dispatch(removeLoader('deleteDepartmentMarket'));
    })
    .catch((err) => {
      const errorParams = {
        ...defaultError,
        message: 'API delete error (department.deleteDepartmentMarket)',
      };

      utils.api.handleError(err, errorParams);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(deleteDepartmentMarketFailure(err));
      dispatch(enqueueNotification('notification.deleteDepartmentMarket.fail', 'error'));
      dispatch(hideModal());
      dispatch(removeLoader('deleteDepartmentMarket'));
      return err;
    });
};

export const deleteDepartmentMarketRequest = (deptMarketId) => {
  return {
    type: 'DEPARTMENT_MARKET_DELETE_REQUEST',
    payload: deptMarketId,
  };
};

export const deleteDepartmentMarketSuccess = (deptMarketId) => {
  return {
    type: 'DEPARTMENT_MARKET_DELETE_SUCCESS',
    payload: deptMarketId,
  };
};

export const deleteDepartmentMarketFailure = (error) => {
  return {
    type: 'DEPARTMENT_MARKET_DELETE_FAILURE',
    payload: error,
  };
};
