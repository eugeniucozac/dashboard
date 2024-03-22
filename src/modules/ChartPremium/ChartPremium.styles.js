const styles = (theme) => ({
  header: {
    marginBottom: theme.spacing(4),

    '&:not(:first-child)': {
      marginTop: theme.spacing(10),
    },
  },
  subtitle: {
    '& .small': {
      color: theme.palette.neutral.main,
      fontSize: '90%',
      fontStyle: 'italic',
    },
  },
});

export default styles;
