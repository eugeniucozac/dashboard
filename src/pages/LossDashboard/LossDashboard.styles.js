const styles = (theme) => ({
  content: {
    position: 'relative',
    flexGrow: 1,
    overflowY: 'auto',
    width: `calc(100% - ${theme.mixins.drawer.width.collapsed / 2}px)`,
    marginRight: theme.mixins.drawer.width.collapsed / 2,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  contentShift: {
    [theme.breakpoints.up('md')]: {
      width: `calc(100% - ${theme.mixins.drawer.width.expanded.md}px)`,
      marginRight: theme.mixins.drawer.width.expanded.md,
    },

    [theme.breakpoints.up('lg')]: {
      width: `calc(100% - ${theme.mixins.drawer.width.expanded.lg}px)`,
      marginRight: theme.mixins.drawer.width.expanded.lg,
    },
  },
});

export default styles;
