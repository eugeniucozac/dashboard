import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import * as Yup from 'yup';

// app
import styles from './Comments.styles';
import { CommentsView } from './Comments.view';
import { selectComments, getComments, postComment } from 'stores';
import * as utils from 'utils';

// mui
import { makeStyles } from '@material-ui/core';

Comments.propTypes = {
  id: PropTypes.string,
  divider: PropTypes.bool,
  title: PropTypes.string,
  truncate: PropTypes.number,
  placeholder: PropTypes.string,
};

Comments.defaultProps = {
  truncate: 280,
};

export default function Comments({ id, divider, title, truncate, placeholder, updateHasComments }) {
  const classes = makeStyles(styles, { name: 'Comments' })();
  const dispatch = useDispatch();
  const comments = useSelector(selectComments(id));
  const user = useSelector((state) => state.user);

  const [expanded, setExpanded] = useState([]);

  const field = {
    name: 'comment',
    type: 'text',
    placeholder: placeholder || utils.string.t('app.writeComment'),
    value: '',
    validation: Yup.string().required(utils.string.t('validation.required')),
    muiComponentProps: {
      multiline: true,
      maxRows: 5,
      classes: {
        root: classes.input,
      },
      'data-testid': `comments-form`,
    },
  };

  useEffect(
    () => {
      if (id) {
        dispatch(getComments(id));
      }
    },
    [id] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const handleClickExpand = (id) => (event) => {
    setExpanded([...expanded, id]);
  };

  const handleSubmit = (reset) => async (values) => {
    await dispatch(postComment(id, values));
    if (utils.generic.isFunction(updateHasComments)) {
      updateHasComments();
    }
    if (utils.generic.isFunction(reset)) {
      reset();
    }
  };

  // abort
  if (!id) return null;

  return (
    <CommentsView
      id={id}
      title={title}
      comments={comments}
      truncate={truncate}
      expanded={expanded}
      divider={divider}
      field={field}
      user={user}
      handleClickExpand={handleClickExpand}
      handlePostComment={handleSubmit}
    />
  );
}
