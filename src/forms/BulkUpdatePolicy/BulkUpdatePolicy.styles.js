const styles = (theme) => ({
  root: {
    ...theme.mixins.modal.dialog.root,
  },
  checkbox: (props) => ({
    transition: theme.transitions.create(['margin', 'padding']),
    ...(props.isDeleteChecked && { marginTop: '0 !important' }),
  }),
});

export default styles;
