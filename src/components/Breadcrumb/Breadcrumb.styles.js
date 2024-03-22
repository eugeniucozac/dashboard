const styles = (theme) => ({
  list: {
    padding: `5px 8px 3px 12px`,
    margin: 0,
    listStyle: 'none',
    backgroundColor: 'white',
  },
  item: {
    display: 'inline-flex',
    margin: 0,
    padding: 0,
    alignItems: 'center',

    '&:last-child > a': {
      paddingRight: 4,
    },
  },
  text: {
    display: 'inline-block',
    padding: '8px 12px 6px',
    color: theme.palette.neutral.dark,
    fontWeight: theme.typography.fontWeightMedium,
  },
  link: {
    color: theme.palette.neutral.main,
    fontWeight: theme.typography.fontWeightRegular,
    cursor: 'pointer',

    '&:hover': {
      color: theme.palette.neutral.darker,
    },
  },
  separator: {
    display: 'inline-block',
    width: 1,
    height: 18,
    transform: 'rotate(15deg)',
    backgroundColor: theme.palette.neutral.light,
  },
  active: {
    color: theme.palette.neutral.dark,
    fontWeight: theme.typography.fontWeightMedium,
  },
  largeFont: {
    [theme.breakpoints.up('sm')]: {
      fontSize: theme.typography.pxToRem(18),
    },
  },
});

export default styles;
