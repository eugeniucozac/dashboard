import * as utils from 'utils';
import { authLogout, enqueueNotification } from 'stores';

export const postComment = (id, formData) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}} = getState();

  const defaultError = {
    file: 'stores/comment.actions.post',
  };

  dispatch(postCommentRequest(id, formData));

  if (!id) {
    return { ...defaultError, message: 'Data missing' };
  }

  return utils.api
    .post({
      token: auth.accessToken,
      endpoint: endpoint?.edge,
      path: `api/comment/${id}`,
      data: {
        message: formData.comment,
      },
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleData(json))
    .then((data) => {
      dispatch(postCommentSuccess(id, data));
      dispatch(enqueueNotification('notification.comment.success', 'success'));
    })
    .catch((err) => {
      const errorParams = {
        ...defaultError,
        message: 'API post error (comment.post)',
      };

      utils.api.handleError(err, errorParams);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(postCommentFailure(err));
      dispatch(enqueueNotification('notification.comment.fail', 'error'));
      return err;
    });
};

export const postCommentRequest = (id, formData) => {
  return {
    type: 'COMMENTS_POST_REQUEST',
    payload: { id, formData },
  };
};

export const postCommentSuccess = (id, responseData) => {
  return {
    type: 'COMMENTS_POST_SUCCESS',
    payload: {
      id,
      comments: responseData,
    },
  };
};

export const postCommentFailure = (error) => {
  return {
    type: 'COMMENTS_POST_FAILURE',
    payload: error,
  };
};
