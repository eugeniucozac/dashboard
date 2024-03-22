const styles = (theme) => ({
  commentsBox: {
    maxWidth: 600,
  },
  popover: {
    pointerEvents: 'none',
  },
  paper: {
    padding: theme.spacing(3),
    paddingTop: 0,
    paddingBottom: 0,
  },
  commentsTitle: {
    position: 'absolute',
    left: theme.spacing(3),
    right: theme.spacing(3),
    top: theme.spacing(2),
  },
  comment: {
    display: 'inline-flex',
    alignItems: 'center',
    width: 16,
    height: 16,
    marginTop: 4,
    color: theme.palette.neutral.main,
  },
  commentIcon: {
    fontSize: '1rem',
    color: theme.palette.neutral.main,
  },
  newCommentIcon: {
    fontSize: '1rem',
    color: theme.palette.primary.main,
  },
});

export default styles;
