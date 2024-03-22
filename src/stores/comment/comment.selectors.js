import { createSelector } from 'reselect';
import get from 'lodash/get';

const selectComments = (id) => {
  return createSelector(
    (state) => get(state, 'comment.items') || {},
    (items) => {
      const comments = items[id] || [];

      return comments.filter((comment) => {
        return comment.message && comment.date && comment.user;
      });
    }
  );
};

export { selectComments };
