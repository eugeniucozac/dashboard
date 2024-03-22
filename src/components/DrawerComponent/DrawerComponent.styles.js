const styles = (theme) => ({
  drawer: ({ isFromDashboard, isExpanded }) => ({
    width: isExpanded ? theme.mixins.drawer.width.expanded.xs : theme.mixins.drawer.width.collapsed,
    height: `calc(100% - ${isFromDashboard ? theme.mixins.header.default.minHeight : 0}px)`,
    flexDirection: 'row',
    marginTop: isFromDashboard ? theme.mixins.header.default.minHeight : 0,
    overflowX: 'hidden',
    overflowY: isExpanded ? 'auto' : 'hidden',
    transition: theme.transitions.create(['transform']),
    transform: `translateX(${isExpanded ? 0 : 30}px)`,

    [theme.breakpoints.up('sm')]: {
      width: isExpanded ? theme.mixins.drawer.width.expanded.sm : theme.mixins.drawer.width.collapsed,
    },

    [theme.breakpoints.up('md')]: {
      width: isExpanded ? theme.mixins.drawer.width.expanded.md : theme.mixins.drawer.width.collapsed,
    },

    [theme.breakpoints.up('lg')]: {
      width: isExpanded ? theme.mixins.drawer.width.expanded.lg : theme.mixins.drawer.width.collapsed,
    },

    '&:hover': {
      transform: `translateX(${isExpanded ? 0 : 4}px)`,
    },
  }),
  button: {
    paddingLeft: 4,
    paddingRight: 4,
    marginLeft: -5,
  },
  buttonExpanded: {
    marginLeft: -8,
  },
  iconArrow: {
    marginLeft: 4,
  },
  iconArrowExpanded: {
    marginLeft: 0,
  },
  iconDocument: {
    marginLeft: 2,
    fontSize: theme.typography.pxToRem(24),
  },
});

export default styles;
