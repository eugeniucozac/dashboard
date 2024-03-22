import * as utils from 'utils';
import { authLogout } from 'stores';

export const getComments = (id) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}} = getState();

  dispatch(getCommentsRequest(id));

  return utils.api
    .get({
      token: auth.accessToken,
      endpoint: endpoint?.edge,
      path: `api/comment/${id}`,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleData(json))
    .then((data) => {
      dispatch(getCommentsSuccess(id, data));
      return data;
    })
    .catch((err) => {
      const errorParams = {
        file: 'stores/comment.actions.get',
        message: 'API fetch error (comment.get)',
      };

      utils.api.handleError(err, errorParams);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(getCommentsFailure(err));
      return err;
    });
};

export const getCommentsRequest = (id) => {
  return {
    type: 'COMMENTS_GET_REQUEST',
    payload: id,
  };
};

export const getCommentsSuccess = (id, responseData) => {
  return {
    type: 'COMMENTS_GET_SUCCESS',
    payload: {
      id,
      comments: responseData,
    },
  };
};

export const getCommentsFailure = (error) => {
  return {
    type: 'COMMENTS_GET_FAILURE',
    payload: error,
  };
};

export const getCommentsByPlacement = (id) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}} = getState();

  dispatch(getCommentsByPlacementRequest(id));

  return utils.api
    .get({
      token: auth.accessToken,
      endpoint: endpoint.edge,
      path: `api/comment/${id}`,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleData(json))
    .then((data) => {
      dispatch(getCommentsByPlacementSuccess(id, data));
      return data;
    })
    .catch((err) => {
      const errorParams = {
        file: 'stores/comment.actions.get',
        message: 'API fetch error (comment.getByPlacement)',
      };

      utils.api.handleError(err, errorParams);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(getCommentsByPlacementFailure(err));
      return err;
    });
};

export const getCommentsByPlacementRequest = (id) => {
  return {
    type: 'COMMENTS_GET_BY_PLACEMENT_REQUEST',
    payload: id,
  };
};

export const getCommentsByPlacementSuccess = (id, responseData) => {
  return {
    type: 'COMMENTS_GET_BY_PLACEMENT_SUCCESS',
    payload: {
      id,
      comments: responseData,
    },
  };
};

export const getCommentsByPlacementFailure = (error) => {
  return {
    type: 'COMMENTS_GET_BY_PLACEMENT_FAILURE',
    payload: error,
  };
};
