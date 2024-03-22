const styles = (theme) => ({
  container: {
    paddingBottom: theme.spacing(1.5),

    '&:not(:first-child)': {
      marginTop: -12,
    },

    '&:last-child': {
      paddingBottom: 0,
    },
  },
  item: {
    paddingBottom: '12px',
    paddingTop: '14px',
  },
});

export default styles;
