import * as utils from 'utils';

export const getRefDataGroups = () => (dispatch, getState) => {
  const {
    user: { auth },
    config: {
      vars: { endpoint },
    },
  } = getState();

  return utils.api
    .get({
      token: auth.accessToken,
      endpoint: endpoint.authService,
      path: 'user/refData/groups',
    })
    .then((response) => utils.api.handleResponse(response))
    .then((data) => utils.api.handleNewData(data))
    .then((json) => {
      dispatch(getGroupsSuccess(json.data));
      return json.data;
    })
    .catch((error) => {
      dispatch(
        getGroupsError(error, {
          file: 'stores/administration.actions.refData.getGroups',
        })
      );
      return error;
    });
};

export const getGroupsSuccess = (groupsRefData) => {
  return {
    type: 'ADMINISTRATION_REF_DATA_GROUPS',
    payload: groupsRefData,
  };
};

export const getGroupsError = (error) => {
  return {
    type: 'ADMINISTRATION_REF_DATA_GROUPS_ERROR',
    payload: error,
  };
};
