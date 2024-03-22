const styles = (theme) => ({
  root: {
    ...theme.mixins.modal.dialog.root,
  },
  promptText: {
    margin: theme.spacing(5),
    paddingTop: theme.spacing(5),
  },
});

export default styles;
