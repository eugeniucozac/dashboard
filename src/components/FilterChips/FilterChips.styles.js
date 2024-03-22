const styles = (theme) => ({
  root: {
    marginBottom: theme.spacing(2),
  },
  chips: {
    margin: `0 ${theme.spacing(1)}px`,
    display: 'flex',
    flexWrap: 'wrap',
    '& > *': {
      margin: theme.spacing(0.3),
    },
  },
});

export default styles;
