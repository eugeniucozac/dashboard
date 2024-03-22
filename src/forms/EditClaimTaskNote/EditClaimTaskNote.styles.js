const styles = (theme) => ({
  root: {
    ...theme.mixins.modal.dialog.root,
  },
  textOnly: {
    color: theme.palette.neutral.main,
  },
  breadcrumbSpacing: {
    paddingLeft: theme.spacing(6),
    fontSize: theme.spacing(1.6),
  }
});

export default styles;
