import { addLoader, authLogout, enqueueNotification, hideModal, removeLoader } from 'stores';
import * as utils from 'utils';
import get from 'lodash/get';
import pick from 'lodash/pick';
import xorWith from 'lodash/xorWith';

export const editDepartmentMarket = (formData) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}} = getState();

  const defaultError = {
    file: 'stores/department.actions.putMarket',
    message: 'Data missing for PUT request',
  };

  const marketId = get(formData, 'marketId');
  const departmentMarketId = get(formData, 'departmentMarketId');
  const departmentId = get(formData, 'departmentId');

  dispatch(putDepartmentMarketRequest(formData));
  dispatch(addLoader('editDepartmentMarket'));

  if (!formData || !departmentId || !marketId || !departmentMarketId) {
    dispatch(putDepartmentMarketFailure(defaultError));
    dispatch(enqueueNotification('notification.editDepartmentMarket.fail', 'error'));
    dispatch(hideModal());
    dispatch(removeLoader('editDepartmentMarket'));
    return;
  }

  const previousUnderwriters = get(formData, 'previousUnderwriters', []);
  const editedUnderwriters = get(formData, 'underwriters', []);

  const allUnderwriters = xorWith(previousUnderwriters, editedUnderwriters, (a, b) => {
    return a.id === b.mktId;
  });

  const underwriters = allUnderwriters
    .filter((uw) => {
      const hasData = uw.firstName || uw.lastName || uw.emailId;
      return hasData || uw.id || uw.mktId;
    })
    .map((uw) => {
      const hasData = uw.firstName || uw.lastName || uw.emailId;
      const id = uw.id || uw.mktId;

      // for DELETE, we check that all data has been removed OR it's origin with an ID
      const isDelete = Boolean((!uw.isOrigin && !hasData) || (uw.isOrigin && id));

      // for CREATE, we check we don't have the origin prop, that we have data and an ID
      const isUpdate = Boolean(!uw.isOrigin && hasData && id);

      // for CREATE, if there's no id (uw.id OR uw.mktId) it's a new underwriter
      const isCreate = Boolean(!id);

      return {
        ...(id && { id }),
        marketId,
        departmentId,
        ...pick(uw, ['firstName', 'lastName', 'emailId']),
        operation: isCreate ? 'CREATE' : isUpdate ? 'UPDATE' : isDelete ? 'DELETE' : null,
      };
    })
    .filter((uw) => {
      return uw.operation;
    });

  return utils.api
    .put({
      token: auth.accessToken,
      endpoint: endpoint.edge,
      path: `api/departmentMarket/${departmentMarketId}`,
      data: {
        departmentId: get(formData, 'departmentId'),
        marketId: marketId,
        capacityTypeId: get(formData, 'capacityTypeId'),
        underwriters,
      },
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleData(json))
    .then((data) => {
      dispatch(putDepartmentMarketSuccess(data));
      dispatch(enqueueNotification('notification.editDepartmentMarket.success', 'success'));
    })
    .catch((err) => {
      const errorParams = {
        ...defaultError,
        message: 'API put error (department.editDepartmentMarket)',
      };

      utils.api.handleError(err, errorParams);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(putDepartmentMarketFailure(err));
      dispatch(enqueueNotification('notification.editDepartmentMarket.fail', 'error'));
      return err;
    })
    .finally(() => {
      dispatch(hideModal());
      dispatch(removeLoader('editDepartmentMarket'));
      return;
    });
};

export const putDepartmentMarketRequest = (formData) => {
  return {
    type: 'DEPARTMENT_MARKET_PUT_REQUEST',
    payload: formData,
  };
};

export const putDepartmentMarketSuccess = (responseData) => {
  return {
    type: 'DEPARTMENT_MARKET_PUT_SUCCESS',
    payload: responseData,
  };
};

export const putDepartmentMarketFailure = (error) => {
  return {
    type: 'DEPARTMENT_MARKET_PUT_FAILURE',
    payload: error,
  };
};
