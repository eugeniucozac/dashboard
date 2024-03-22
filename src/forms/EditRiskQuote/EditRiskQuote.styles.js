const styles = (theme) => ({
  root: {
    ...theme.mixins.modal.dialog.root,
    minHeight: 200,
    '& legend': {
      marginBottom: 0,
      marginTop: 32,
      border: 0,
      textTransform: 'none',
      fontWeight: 400,
      color: theme.palette.grey[500],
    },
  },
});
export default styles;
