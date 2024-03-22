const styles = (theme) => ({
  root: {
    ...theme.mixins.modal.dialog.root,
    minHeight: 'auto',
  },
  comment: {
    margin: theme.spacing(1, 4),
  },
  message: {
    padding: theme.spacing(2, 4),
  },
  warning: {
    padding: theme.spacing(1, 4),
  },
  warningText: {
    color: theme.palette.error.dark,
  },
});

export default styles;
