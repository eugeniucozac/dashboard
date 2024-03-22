import * as utils from 'utils';
import { authLogout } from 'stores';

export const getDepartments = () => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}} = getState();

  const defaultError = {
    file: 'stores/processingInstructions.actions.getDepartments',
  };

  dispatch(getDepartmentListRequest());

  return utils.api
    .get({
      token: auth.accessToken,
      endpoint: endpoint.authService,
      path: 'user/advanceSearch/departments',
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleNewData(json))
    .then((data) => {
      dispatch(getDepartmentListSuccess(data.data));
      return data.data;
    })
    .catch((err) => {
      utils.api.handleError(err, { ...defaultError, message: 'API fetch error (processingInstructions.getDepartments)' });
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(getDepartmentListFailure(err));
      return err;
    });
};

export const getDepartmentListRequest = (payload) => {
  return {
    type: 'PROCESSING_INSTRUCTIONS_GET_DEPARTMENTS_REQUEST',
    payload,
  };
};

export const getDepartmentListSuccess = (responseData) => {
  return {
    type: 'PROCESSING_INSTRUCTIONS_GET_DEPARTMENTS_SUCCESS',
    payload: responseData,
  };
};

export const getDepartmentListFailure = (error) => {
  return {
    type: 'PROCESSING_INSTRUCTIONS_GET_DEPARTMENTS_FAILURE',
    payload: error,
  };
};
