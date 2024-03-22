import * as utils from 'utils';
import { authLogout, enqueueNotification } from 'stores';

export const deleteComment = (id, commentId) => (dispatch, getState) => {
  // prettier-ignore
  const { user: { auth }, config: { vars: { endpoint }}} = getState();

  const defaultError = {
    file: 'stores/comment.actions.delete',
  };

  dispatch(deleteCommentRequest(commentId));

  if (!id) {
    return { ...defaultError, message: 'Data missing' };
  }

  return utils.api
    .delete({
      token: auth.accessToken,
      endpoint: endpoint.edge,
      path: `api/comment/${commentId}`,
    })
    .then((response) => utils.api.handleResponse(response))
    .then((json) => utils.api.handleData(json))
    .then((data) => {
      dispatch(deleteCommentSuccess(id, commentId));
      dispatch(enqueueNotification('notification.deleteComment.success', 'success'));
    })
    .catch((err) => {
      const errorParams = {
        ...defaultError,
        message: 'API post error (comment.delete)',
      };

      utils.api.handleError(err, errorParams);
      utils.api.handleUnauthorized(err, dispatch, authLogout);
      dispatch(deleteCommentFailure(err));
      dispatch(enqueueNotification('notification.deleteComment.fail', 'error'));
      return err;
    });
};

export const deleteCommentRequest = (id) => {
  return {
    type: 'COMMENTS_DELETE_REQUEST',
    payload: { id },
  };
};

export const deleteCommentSuccess = (id, commentId) => {
  return {
    type: 'COMMENTS_DELETE_SUCCESS',
    payload: {
      id,
      commentId,
    },
  };
};

export const deleteCommentFailure = (error) => {
  return {
    type: 'COMMENTS_DELETE_FAILURE',
    payload: error,
  };
};
