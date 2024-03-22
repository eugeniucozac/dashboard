const styles = (theme) => ({
  actions: {
    display: 'flex',
    marginTop: theme.spacing(4),

    '& > button': {
      marginLeft: theme.spacing(0.5),
      marginRight: theme.spacing(0.5),

      '&:first-child': {
        margin: 0,
      },

      '&:last-child': {
        marginRight: 0,
      },
    },
  },
  actionsDialog: {
    flex: '0 1 auto',
    marginTop: 0,
    justifyContent: 'flex-end',
  },
  actionsLeft: {
    justifyContent: 'flex-start',
  },
  actionsRight: {
    justifyContent: 'flex-end',
  },
});

export default styles;
