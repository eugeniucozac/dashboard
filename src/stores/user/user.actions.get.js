import { addLoader, authLogout, removeLoader, setDepartmentSelected } from 'stores';
import * as utils from 'utils';
import get from 'lodash/get';

export const getUser = (params) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}} = getState();

  const defaultError = {
    file: 'stores/user.actions.get',
  };

  dispatch(getUserRequest());
  dispatch(addLoader('getUser'));

  return new Promise((resolve, reject) => {
    utils.api
      .get({
        token: auth.accessToken,
        endpoint: endpoint.edge,
        path: 'api/user',
      })
      .then((response) => utils.api.handleResponse(response))
      .then((json) => utils.api.handleData(json))
      .then((data) => {
        dispatch(getUserSuccess(data));

        // checking that the logged in user departments and saved dept (localStorage) match
        // if the saved department in localStorage isn't one of the user, we replace it
        const depts = data ? get(data, 'departmentIds') || [] : [];
        const firstDept = get(data, 'departmentIds[0]', '').toString();
        const savedDept = (localStorage.getItem('edge-department') || '').toString();

        if (!depts.map((d) => d.toString()).includes(savedDept)) {
          dispatch(setDepartmentSelected(firstDept));
        }

        dispatch(removeLoader('getUser'));

        resolve(data);
      })
      .catch((err) => {
        utils.api.handleError(err, defaultError);
        utils.api.handleUnauthorized(err, dispatch, authLogout);
        dispatch(getUserFailure(err));
        dispatch(removeLoader('getUser'));
        reject(err);
      });
  });
};

export const getUserRequest = () => {
  return {
    type: 'USER_GET_REQUEST',
  };
};

export const getUserSuccess = (userData) => {
  return {
    type: 'USER_GET_SUCCESS',
    payload: userData,
  };
};

export const getUserFailure = (error) => {
  return {
    type: 'USER_GET_FAILURE',
    payload: error,
  };
};
