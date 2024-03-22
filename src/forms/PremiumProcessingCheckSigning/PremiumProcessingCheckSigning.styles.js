const styles = (theme) => ({
  root: {
    ...theme.mixins.modal.dialog.root,
  },
  departmentRow: {
    marginBottom: 0,
  },
  popoverDept: {
    width: `280px !important`,
  },
  upperCaseLetter: {
    textTransform: 'uppercase',
  }
});
export default styles;
