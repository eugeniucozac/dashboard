const styles = (theme) => ({
  root: {
    position: 'relative',
    padding: theme.spacing(3),
    marginBottom: theme.spacing(4),
    boxShadow: 'none',
    borderRadius: 0,

    [theme.breakpoints.up('sm')]: {
      padding: theme.spacing(5),
    },

    '&:last-child': {
      marginBottom: 0,
    },
  },
  sidebar: {
    borderTop: `1px solid ${theme.palette.neutral.light}`,

    [theme.breakpoints.up('md')]: {
      borderTop: 0,
      borderLeft: `1px solid ${theme.palette.neutral.light}`,
      minHeight: '100%',
    },
  },
  borderTop: {
    borderTop: `1px solid ${theme.palette.neutral.light}`,
  },
  borderRight: {
    borderRight: `1px solid ${theme.palette.neutral.light}`,
  },
  borderBottom: {
    borderBottom: `1px solid ${theme.palette.neutral.light}`,
  },
  borderLeft: {
    borderLeft: `1px solid ${theme.palette.neutral.light}`,
  },
  noMargin: {
    margin: 0,
  },
  noPadding: {
    padding: 0,
  },
});

export default styles;
