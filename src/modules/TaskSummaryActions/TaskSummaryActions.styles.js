const styles = (theme) => ({
  taskActionsWrapper: {
    padding: theme.spacing(0.5, 3.5),
  },
  taskActionsRow: {
    padding: theme.spacing(0.5),
    '& button': {
      marginRight: theme.spacing(0.5),
      marginBottom: theme.spacing(1),
    },
  },
});

export default styles;
