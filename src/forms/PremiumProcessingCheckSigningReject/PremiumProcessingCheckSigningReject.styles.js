const styles = (theme) => ({
  root: {
    ...theme.mixins.modal.dialog.root,
  },
  departmentRow: {
    marginBottom: 0,
  },
  bottomMargin: {
    marginBottom: theme.spacing(2.5),
    marginRight: theme.spacing(2),
  },
  leftMargin: {
    marginLeft: theme.spacing(2.5),
  },
  upperCaseLetter: {
    textTransform: 'uppercase',
  }
});
export default styles;
