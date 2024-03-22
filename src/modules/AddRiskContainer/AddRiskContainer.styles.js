const styles = (theme) => ({
  root: {
    ...theme.mixins.modal.dialog.root,
    justifyContent: 'center',
  },
  productLoading: {
    display: 'flex',
  },
  productLoadingCircular: {
    color: theme.palette.neutral.medium,
    '& svg': {
      color: 'inherit',
    },
  },
  productLoadingText: {
    marginLeft: (props) => (props.loading ? 0 : -28),
    transition: theme.transitions.create(['margin-left'], { duration: 500 }),
  },
});

export default styles;
