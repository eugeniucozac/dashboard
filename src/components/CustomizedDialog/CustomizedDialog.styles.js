const styles = (theme) => ({
  dialog: {
    marginRight: theme.mixins.drawer.width.collapsed / 2,
  },
  dialogExpanded: {
    marginRight: theme.mixins.drawer.width.expanded.xs,

    [theme.breakpoints.up('sm')]: {
      marginRight: theme.mixins.drawer.width.expanded.sm,
    },

    [theme.breakpoints.up('md')]: {
      marginRight: theme.mixins.drawer.width.expanded.md,
    },

    [theme.breakpoints.up('lg')]: {
      marginRight: theme.mixins.drawer.width.expanded.lg,
    },
  },
  title: {
    marginBottom: 0,
  },
  subtitle: {
    marginBottom: 0,
  },
  close: {
    position: 'absolute',
    top: 11,
    right: 11,
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    overflow: 'auto',
  },
  container: {
    flex: 1,
    display: 'flex',
    marginTop: 0,
    minHeight: 150,
    overflowY: 'hidden',
    flexDirection: 'column',
  },
});

export default styles;
