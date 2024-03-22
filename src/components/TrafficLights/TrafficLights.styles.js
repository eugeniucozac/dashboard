const styles = (theme) => ({
  root: {
    whiteSpace: 'nowrap',
  },
  item: {
    marginRight: 4,

    '&:last-child': {
      marginRight: 0,
    },

    [theme.breakpoints.up('sm')]: {
      marginRight: 6,
    },
  },
});

export default styles;
