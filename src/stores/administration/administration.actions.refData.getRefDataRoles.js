import * as utils from 'utils';

export const getRefDataRoles = (groupIds) => (dispatch, getState) => {
  const {
    user: { auth },
    config: {
      vars: { endpoint },
    },
  } = getState();

  if (!groupIds) return Promise.resolve([]);

  return utils.api
    .get({
      token: auth.accessToken,
      endpoint: endpoint.authService,
      path: 'user/refData/roles',
      params: { groupIds: groupIds },
    })
    .then((response) => utils.api.handleResponse(response))
    .then((data) => utils.api.handleNewData(data))
    .then((json) => {
      dispatch(getRolesSuccess(json.data));
      return json.data;
    })
    .catch((error) => {
      dispatch(
        getRolesError(error, {
          file: 'stores/administration.actions.refData.getRoles',
        })
      );
      return error;
    });
};

export const getRolesSuccess = (roles) => {
  return {
    type: 'ADMINISTRATION_REF_DATA_ROLES',
    payload: roles,
  };
};

export const getRolesError = (error) => {
  return {
    type: 'ADMINISTRATION_REF_DATA_ROLES_ERROR',
    payload: error,
  };
};
