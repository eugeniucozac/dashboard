import { addLoader, authLogout, enqueueNotification, hideModal, removeLoader } from 'stores';
import * as utils from 'utils';
import get from 'lodash/get';

export const addDepartmentMarket = (formData) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}} = getState();

  const defaultError = {
    file: 'stores/department.actions.postMarket',
    message: 'Data missing for POST request',
  };

  const marketId = get(formData, 'markets[0].id');
  const departmentId = get(formData, 'departmentId');

  dispatch(postDepartmentMarketRequest(formData));
  dispatch(addLoader('addDepartmentMarket'));

  if (!formData || !departmentId || !marketId) {
    dispatch(postDepartmentMarketFailure(defaultError));
    dispatch(enqueueNotification('notification.addDepartmentMarket.fail', 'error'));
    dispatch(hideModal());
    dispatch(removeLoader('addDepartmentMarket'));
    return;
  }

  const underwriters = get(formData, 'underwriters', [])
    .filter((uw) => {
      return uw.firstName || uw.lastName || uw.emailId;
    })
    .map((uw) => {
      return {
        ...uw,
        marketId,
        departmentId,
        operation: 'CREATE',
      };
    });

  return utils.api
    .post({
      token: auth.accessToken,
      endpoint: endpoint.edge,
      path: 'api/departmentMarket',
      data: {
        marketId: marketId,
        departmentId: get(formData, 'departmentId'),
        capacityTypeId: get(formData, 'capacityTypeId'),
        underwriters,
      },
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleData(json))
    .then((data) => {
      dispatch(postDepartmentMarketSuccess(data));
      dispatch(enqueueNotification('notification.addDepartmentMarket.success', 'success'));
    })
    .catch((err) => {
      const errorParams = {
        ...defaultError,
        message: 'API post error (department.addDepartmentMarket)',
      };

      utils.api.handleError(err, errorParams);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(postDepartmentMarketFailure(err));
      dispatch(enqueueNotification('notification.addDepartmentMarket.fail', 'error'));
      return err;
    })
    .finally(() => {
      dispatch(hideModal());
      dispatch(removeLoader('addDepartmentMarket'));
      return;
    });
};

export const postDepartmentMarketRequest = (formData) => {
  return {
    type: 'DEPARTMENT_MARKET_POST_REQUEST',
    payload: formData,
  };
};

export const postDepartmentMarketSuccess = (responseData) => {
  return {
    type: 'DEPARTMENT_MARKET_POST_SUCCESS',
    payload: responseData,
  };
};

export const postDepartmentMarketFailure = (error) => {
  return {
    type: 'DEPARTMENT_MARKET_POST_FAILURE',
    payload: error,
  };
};
