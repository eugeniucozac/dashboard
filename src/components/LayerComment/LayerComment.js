import React, { useState, useEffect, useRef } from 'react';

import * as utils from 'utils';

import styles from './LayerComment.styles';
import { Popover, Box, Typography, IconButton, makeStyles } from '@material-ui/core';
import { Comments } from 'components';
import CommentIcon from '@material-ui/icons/Comment';
import CloseIcon from '@material-ui/icons/Close';

const LayerComments = ({ hasComments, newComments, commentsOptions, handleAddCommentClose, isOpen = false }) => {
  const [commentsOpen, setCommentsOpen] = useState(isOpen);
  const [stateHasComments, setHasComments] = useState(false);
  const [stateNewComments, setNewComments] = useState(false);

  const classes = makeStyles(styles, { name: 'LayerMarketComment' })();
  const inputEl = useRef(null);

  useEffect(() => {
    setHasComments(hasComments ? true : false);
  }, [hasComments]);

  useEffect(() => {
    setNewComments(newComments ? true : false);
  }, [newComments]);

  useEffect(() => {
    setCommentsOpen(isOpen);
  }, [isOpen]);

  const handleClick = () => {
    setCommentsOpen(true);
  };

  const handleClose = () => {
    utils.generic.isFunction(handleAddCommentClose) && handleAddCommentClose();
    setCommentsOpen(false);
  };

  const handleUpdateComments = () => {
    setHasComments(true);
    setNewComments(true);
  };

  const id = commentsOpen ? 'comments-popover' : undefined;

  return (
    <div ref={inputEl}>
      {stateHasComments ? (
        <IconButton
          size={'small'}
          aria-owns={commentsOpen ? 'comments-popover' : undefined}
          aria-haspopup="true"
          aria-label="Comments"
          onClick={handleClick}
        >
          <CommentIcon className={stateNewComments ? classes.newCommentIcon : classes.commentIcon} />
        </IconButton>
      ) : null}

      <Popover
        id={id}
        classes={{
          paper: classes.paper,
        }}
        open={commentsOpen}
        anchorEl={inputEl.current}
        disableScrollLock={true}
        disableRestoreFocus
        onClose={handleClose}
      >
        <>
          <Box className={classes.commentsBox}>
            <Box display="flex" alignItems="center" justifyContent="space-between" className={classes.commentsTitle}>
              <Typography>Comments</Typography>
              <IconButton size="small" aria-label="close" onClick={handleClose} className={classes.closeIcon}>
                <CloseIcon />
              </IconButton>
            </Box>

            <Comments
              id={commentsOptions.id}
              title={commentsOptions.title}
              divider={commentsOptions.divider}
              placeholder={commentsOptions.placeholder}
              updateHasComments={handleUpdateComments}
            />
          </Box>
        </>
      </Popover>
    </div>
  );
};

export default LayerComments;
