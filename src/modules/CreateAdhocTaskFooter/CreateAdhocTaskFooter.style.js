const styles = (theme) => ({
  footer: ({ isAllStepsCompleted }) => ({
    display: 'flex',
    justifyContent: 'flex-end',
    position: 'sticky',
    bottom: theme.typography.pxToRem(-16),
    right: 0,
    left: 0,
    backgroundColor: 'white',
    padding: theme.spacing(3, 4),
    textAlign: 'right',
    borderTop: theme.mixins.divider,
  }),
  button: {
    margin: theme.spacing(0, 1),

    '&:first-child': {
      marginLeft: 0,
    },

    '&:last-child': {
      marginRight: 0,
    },
  },
});

export default styles;
