const styles = (theme) => ({
  root: {
    ...theme.mixins.modal.dialog.root,
  },
  list: {
    fontSize: theme.typography.pxToRem(11),
    color: theme.palette.neutral.main,
  },
  taskId: {
    border: '0 !important',
  },
  listTitle: {
    fontWeight: theme.typography.fontWeightMedium,
    fontSize: theme.typography.pxToRem(11),
    color: theme.palette.neutral.dark,
    marginLeft: theme.spacing(0.25),
    marginRight: theme.spacing(0.5),
  },
});

export default styles;
