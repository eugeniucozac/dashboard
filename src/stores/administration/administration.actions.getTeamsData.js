import * as utils from 'utils';

export const getTeamsData = () => (dispatch, getState) => {
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
      path: 'user/refData/organisations',
    })
    .then((response) => utils.api.handleResponse(response))
    .then((data) => utils.api.handleNewData(data))
    .then((json) => {
      dispatch(getTeamsDataSuccess(json.data));
      return json.data;
    })
    .catch((error) => {
      dispatch(
        getTeamsDataFailure(error, {
          file: 'stores/administration.actions.getTeamsData',
        })
      );
      return error;
    });
};

export const getTeamsDataSuccess = (data) => {
  return {
    type: 'ADMINISTRATION_TEAMS_DATA_SUCCESS',
    payload: data,
  };
};

export const getTeamsDataFailure = (data) => {
  return {
    type: 'ADMINISTRATION_TEAMS_DATA_FAILURE',
    payload: data,
  };
};
