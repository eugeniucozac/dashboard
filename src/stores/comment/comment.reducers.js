import * as utils from 'utils';
import get from 'lodash/get';
import has from 'lodash/has';
import { firstBy } from 'thenby';

const initialState = {
  items: {},
};

const sortComments = (comments) => {
  return comments.sort(firstBy(utils.sort.array('date', 'date')));
};

const commentReducers = (state = initialState, action) => {
  switch (action.type) {
    case 'COMMENTS_GET_SUCCESS':
      const getCommentsId = action.payload.id;
      let getComments = action.payload.comments || [];

      if (!getCommentsId || getComments.length <= 0) {
        return state;
      }

      if (getComments.length > 0) {
        getComments = getComments.filter((comment) => {
          return comment.message && comment.date && has(comment, 'user.id');
        });
      }

      return {
        ...state,
        items: {
          ...state.items,
          [getCommentsId]: sortComments(getComments),
        },
      };

    case 'COMMENTS_GET_BY_PLACEMENT_SUCCESS':
      const url = action.payload.id;
      let allComments = action.payload.comments || [];

      if (!url || allComments.length <= 0) {
        return state;
      }

      if (allComments.length > 0) {
        allComments = allComments.filter((comment) => {
          return comment.typeId && comment.message && comment.date && has(comment, 'user.id');
        });
      }

      const newComments = {};

      sortComments(allComments).forEach((comment) => {
        const marketUrl = `${url}/${comment.typeId}`;
        if (!newComments[marketUrl]) {
          newComments[marketUrl] = [];
        }
        newComments[marketUrl].push(comment);
      });

      return {
        ...state,
        items: {
          ...state.items,
          ...newComments,
        },
      };

    case 'COMMENTS_POST_SUCCESS': {
      const postCommentsId = action.payload.id;
      let postComments = action.payload.comments || [];

      const postPreviousComments = get(state, `items[${postCommentsId}]`) || [];

      return {
        ...state,
        items: {
          ...state.items,
          [postCommentsId]: sortComments([...postPreviousComments, postComments]),
        },
      };
    }

    case 'COMMENTS_DELETE_SUCCESS': {
      const postCommentsId = action.payload.id;
      const postPreviousComments = get(state, `items[${postCommentsId}]`) || [];

      return {
        ...state,
        items: {
          ...state.items,
          [postCommentsId]: postPreviousComments.filter((comment) => comment.id !== action.payload.commentId),
        },
      };
    }
    default:
      return state;
  }
};

export default commentReducers;
