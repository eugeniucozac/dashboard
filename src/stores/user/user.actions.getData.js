import { authLogout, setDepartmentSelected } from 'stores';
import * as utils from 'utils';
import get from 'lodash/get';

export const getUserData = (params) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}} = getState();

  const defaultError = {
    file: 'stores/user.actions.getData',
  };

  dispatch(getUserDataRequest(params));

  return utils.api
    .get({
      token: auth.accessToken,
      endpoint: endpoint.authService,
      path: 'user/role/info',
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => {
      if (json?.status === 'OK' && utils.generic.isValidObject(json?.data, 'userDetails')) {
        return json.data;
      } else {
        return Promise.reject({
          message: `API error${json.status ? ` (${json.status})` : ''}`,
          ...(json && { ...json }),
        });
      }
    })
    .then((data) => {
      if (utils.generic.isValidObject(data, 'userDetails')) {
        dispatch(getUserDataSuccess(data));

        // checking that the logged in user departments and saved dept (localStorage) match
        // if the saved department in localStorage isn't one of the user, we replace it
        const deptsArray = data ? get(data, 'xbInstance[0].department') || [] : [];
        const deptsIds = deptsArray.map((d) => d.id);
        const firstDept = utils.generic.isValidArray(deptsIds, true) ? (deptsIds[0] || '').toString() : null;
        const savedDept = (localStorage.getItem('edge-department') || '').toString();

        if (firstDept && !deptsIds.includes(savedDept)) {
          dispatch(setDepartmentSelected(firstDept));
        }
      }

      return data;
    })
    .catch((err) => {
      utils.api.handleError(err, { ...defaultError, message: 'API fetch error (user.getData)' });
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(getUserDataFailure(err));
      return Promise.reject(err);
    });
};

export const getUserDataRequest = (params) => {
  return {
    type: 'USER_DATA_GET_REQUEST',
    payload: params,
  };
};

export const getUserDataSuccess = (userData) => {
  return {
    type: 'USER_DATA_GET_SUCCESS',
    payload: userData,
  };
};

export const getUserDataFailure = (error) => {
  return {
    type: 'USER_DATA_GET_FAILURE',
    payload: error,
  };
};
