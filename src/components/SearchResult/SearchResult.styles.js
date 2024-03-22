const styles = (theme) => ({
  root: {},
  text: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3.5),
    color: theme.palette.neutral.dark,
  },
  noResults: {
    marginTop: -theme.spacing(3),
  },
  noResultsLink: {
    color: theme.palette.secondary.main,
    cursor: 'pointer',
  },
});

export default styles;
