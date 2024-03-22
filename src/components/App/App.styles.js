const styles = (theme) => ({
  root: {
    backgroundColor: 'white',
  },
  body: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: theme.mixins.header.height,
    height: `calc(100vh - ${theme.mixins.header.height}px)`,

    [theme.breakpoints.up('sm')]: {
      flexDirection: 'row',
    },

    [theme.breakpoints.up('md')]: {
      height: `calc(100vh - ${theme.mixins.header.height}px)`,
    },
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    flex: '1 1 auto',
    position: 'relative',
    backgroundColor: theme.palette.grey[50],

    [theme.breakpoints.up('sm')]: {
      backgroundColor: 'white',
      overflowX: 'hidden',
    },
  },
  alertRoot: {
    position: 'fixed',
    backgroundColor: theme.palette.primary.main,
    bottom: 0,
    left: 0,
    height: theme.mixins.header.default.minHeight,
    width: '100%',
    zIndex: 9999,
    alignItems: 'center',
    borderRadius: 0,
  },
});

export default styles;
