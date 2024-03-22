const styles = (theme) => ({
  root: {
    ...theme.mixins.modal.dialog.root,
    minHeight: 240,
  },
  input: {
    textAlign: 'left !important',
    paddingLeft: '14px !important',
    paddingRight: '8px !important',
  },
});

export default styles;
