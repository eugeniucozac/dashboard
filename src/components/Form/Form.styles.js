const styles = (theme) => ({
  root: (props) => ({
    width: props.fullwidth ? '100%' : 'auto',
    ...(props.isDialog && theme.mixins.modal.dialog.root),
  }),
  cancel: {
    marginLeft: -8,
  },
});

export default styles;
