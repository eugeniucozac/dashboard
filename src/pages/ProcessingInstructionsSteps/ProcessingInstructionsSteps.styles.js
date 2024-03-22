const styles = (theme) => ({
  stepper: {
    width: `calc(100% + ${theme.spacing(2)}px) !important`,
    marginTop: theme.spacing(-2),
    marginLeft: theme.spacing(-1),
    marginRight: theme.spacing(-1),
  },
  saveBar: {
    marginBottom: `${theme.spacing(-3) - 1}px`,

    [theme.breakpoints.up('sm')]: {
      marginBottom: `${theme.spacing(-5) - 1}px`,
    },
  },
  button: {
    margin: `0 ${theme.spacing(0.75)}px`,

    '&:first-child': {
      marginLeft: 0,
    },

    '&:last-child': {
      marginRight: 0,
    },
  },
  status: {
    marginLeft: theme.spacing(2),
  },
});

export default styles;
