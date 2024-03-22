const styles = (theme) => ({
  root: {
    ...theme.mixins.modal.dialog.root,
  },
  legend: {
    '& > legend': {
      marginBottom: 0,
    },
  },
});

export default styles;
