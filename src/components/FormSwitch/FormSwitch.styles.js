const styles = (theme) => ({
  root: {
    marginTop: theme.spacing(2),
    paddingBottom: 12,

    '&:first-child': {
      marginTop: 0,
    },

    '&:last-child': {
      paddingBottom: 0,
    },
  },
  title: (props) => ({
    marginBottom: theme.spacing(0.5),
    ...(props.hasError && { color: theme.palette.error.main }),
  }),
});

export default styles;
