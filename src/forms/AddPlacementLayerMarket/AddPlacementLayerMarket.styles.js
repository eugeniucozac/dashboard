const styles = (theme) => ({
  root: {
    ...theme.mixins.modal.dialog.root,
  },
  input: {
    textAlign: 'left !important',
    paddingLeft: '14px !important',
    paddingRight: '8px !important',
  },
  dateFields: {
    marginTop: '2px !important',
  },
  iconWritten: {
    fontSize: 18,
  },
  section: {
    textTransform: 'uppercase',
  },
});

export default styles;
