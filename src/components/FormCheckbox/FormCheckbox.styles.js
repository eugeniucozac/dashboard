const styles = (theme) => ({
  checkbox: {
    marginRight: 2,
    marginLeft: 5,
    padding: 6,
  },
  errorMessage: {
    marginTop: -10,
  },
  checkboxGroup: {
    marginTop: theme.spacing(2),
    paddingBottom: 12,

    '&:first-child': {
      marginTop: 0,
    },

    '&:last-child': {
      paddingBottom: 0,
    },
  },
  checkboxLabel: {
    marginLeft: -theme.spacing(1),

    '&:first-child': {
      marginTop: theme.spacing(0.5),
    },
  },
  title: {
    marginBottom: theme.spacing(0.5),
  },
});

export default styles;
