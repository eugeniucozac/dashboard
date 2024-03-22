const styles = (theme) => ({
  root: {
    ...theme.mixins.modal.dialog.root,
    minHeight: 'auto',
  },
  scrollableConfirmBody: {
    maxHeight: 'calc(100% - 80px)',
    overflowY: 'auto',
  },
});

export default styles;
