const styles = (theme) => ({
  root: {
    ...theme.mixins.modal.dialog.root,
    minHeight: 400,
  },
  textField: {
    paddingBottom: 0,
  },
  button: {
    height: 44,
    marginTop: 19,
    marginLeft: 12,
  },
  listTitle: {
    fontSize: theme.typography.pxToRem(13),
  },
  listError: {
    fontSize: theme.typography.pxToRem(13),
  },
});
export default styles;
