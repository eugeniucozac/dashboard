const styles = (theme) => ({
  icon: {
    marginLeft: 6,
    marginRight: 4,
    color: theme.palette.grey[500],
  },
  drawer: {
    width: theme.mixins.nav.width.default,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    zIndex: 1,
  },
  paper: {
    top: theme.mixins.header.height,
    height: `calc(100% - ${theme.mixins.header.height}px)`,
  },
  drawerOpen: {
    width: theme.mixins.nav.width.default,
    transition: theme.transitions.create('width', {
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    width: theme.mixins.nav.width.collapsed,
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  divider: {
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
  },
  mobileToolbar: {
    borderTop: '3px solid transparent',
  },
});

export default styles;
