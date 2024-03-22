import * as utils from 'utils';

export const getRefDataDepartments = (xbInstanceIds) => (dispatch, getState) => {
  const {
    user: { auth },
    config: {
      vars: { endpoint },
    },
  } = getState();

  if (!xbInstanceIds) return Promise.resolve([]);

  return utils.api
    .get({
      token: auth.accessToken,
      endpoint: endpoint.authService,
      path: 'user/refData/departments',
      params: { xbInstanceIds: xbInstanceIds },
    })
    .then((response) => utils.api.handleResponse(response))
    .then((data) => utils.api.handleNewData(data))
    .then((json) => {
      dispatch(getDepartmentsSuccess(json.data));
      return json.data;
    })
    .catch((error) => {
      dispatch(
        getDepartmentsError(error, {
          file: 'stores/administration.actions.refData.getDepartments',
        })
      );
      return error;
    });
};

export const getDepartmentsSuccess = (departments) => {
  return {
    type: 'ADMINISTRATION_REF_DATA_DEPARTMENTS',
    payload: departments,
  };
};

export const getDepartmentsError = (error) => {
  return {
    type: 'ADMINISTRATION_REF_DATA_DEPARTMENTS_ERROR',
    payload: error,
  };
};
