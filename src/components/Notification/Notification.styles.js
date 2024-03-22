const styles = (theme) => ({
  root: {
    backgroundColor: theme.palette.primary.main,
  },
  success: {
    backgroundColor: theme.palette.success.main,
  },
  error: {
    backgroundColor: theme.palette.error.main,
  },
  info: {
    backgroundColor: theme.palette.info.main,
  },
  warning: {
    backgroundColor: theme.palette.alert.main,
  },
  notification: {
    zIndex: theme.zIndex.toasterMsg,
    whiteSpace: 'pre-wrap'
  },
  icon: {
    fontSize: 20,
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing(1),
  },
  close: {
    color: 'inherit',
    padding: theme.spacing(1),

    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.16)',
      color: 'inherit',
    },
  },
});

export default styles;
