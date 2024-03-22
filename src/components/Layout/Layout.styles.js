const styles = (theme) => ({
  container: (p) => ({
    display: 'flex',
    flex: '1 1 auto',
    flexDirection: 'column',
    flexWrap: 'nowrap',

    [theme.breakpoints.up('md')]: {
      flexDirection: 'row',
      overflowY: 'auto',

      ...(p.desktopControls && {
        overflowX: 'hidden',
      }),
    },
  }),
  scrollBarVisiable: {
    '&::-webkit-scrollbar': {
      display: 'none',
    },
  },
  pageContainer: {
    maxWidth: 1400,
    width: '100%',
    marginLeft: 'auto',
    marginRight: 'auto',
    border: `1px solid ${theme.palette.neutral.light}`,
    borderTop: 0,
  },
  grid: {
    backgroundColor: 'white',

    [theme.breakpoints.up('md')]: {
      height: '100%',
      overflowY: 'auto',
    },
    '&:not(:last-child)': {
      [theme.breakpoints.down('xs')]: {
        paddingBottom: 0,
      },
    },
    '&:not(:first-child)': {
      [theme.breakpoints.down('xs')]: {
        paddingTop: 0,
      },
    },
  },
  main: (p) => ({
    display: 'flex',
    flexDirection: 'column',
    flex: '1 0 auto',

    [theme.breakpoints.down('sm')]: {
      pointerEvents: p.hasSidebar && !p.collapsed ? 'none' : 'auto',
    },

    [theme.breakpoints.only('sm')]: {
      width: p.hasSidebar ? `calc(100% - ${theme.mixins.panel.width.collapsed}px)` : 'auto',
    },

    [theme.breakpoints.up('md')]: {
      flex: p.hasSidebar ? `1 1 66.6666%` : '1 1 100%',

      ...(p.desktopControls && {
        flex: `1 0 ${p.collapsed ? `calc(100% - ${theme.mixins.panel.width.collapsed}px)` : '66.6666%'}`,
        transition: theme.transitions.create(['flex'], { duration: theme.transitions.duration.enteringScreen }),
      }),
    },
  }),
  sidebar: (p) => ({
    [theme.breakpoints.down('sm')]: {
      position: 'fixed',
      top: theme.mixins.header.height - 1,
      left: p.collapsed ? `calc(100% - ${theme.mixins.panel.width.collapsed}px)` : `calc(100% - ${theme.mixins.panel.width.tablet}px)`,
      bottom: 0,
      width: theme.mixins.panel.width.tablet,
      zIndex: 4,
      overflow: 'visible',
      backgroundColor: 'white',
      boxShadow: p.collapsed
        ? 'none'
        : `-1px 0px 2px 0px ${theme.palette.neutral.light}, -2px 0px 2px 0px ${theme.palette.neutral.lighter}`,
      transition: theme.transitions.create(['left', 'background-color'], { duration: theme.transitions.duration.enteringScreen }),

      // hiding everything except the sidebar handle
      '& > *:not(:first-child)': {
        opacity: p.collapsed ? 0 : 1,
        pointerEvents: p.collapsed ? 'none' : 'auto',
      },
    },

    [theme.breakpoints.down('xs')]: {
      left: p.collapsed ? '100%' : '20%',
      width: '80%',
    },

    [theme.breakpoints.up('md')]: {
      flex: '1 1 33.3333%',

      ...(p.desktopControls && {
        position: 'relative',
        flexShrink: 0,
        overflow: 'visible',
        backgroundColor: 'white',

        // hiding everything except the sidebar handle
        '& > *:not(:first-child)': {
          opacity: p.collapsed ? 0 : 1,
          pointerEvents: p.collapsed ? 'none' : 'auto',
          transition: theme.transitions.create(['opacity'], {
            duration: theme.transitions.duration.enteringScreen,
          }),
        },
      }),
    },
  }),
  sidebarScroll: (p) => ({
    height: '100%',

    [theme.breakpoints.down(p.desktopControls ? 'xl' : 'sm')]: {
      overflowY: 'auto',
    },
  }),
  overlay: (p) => ({
    position: 'fixed',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    width: '100%',
    height: p.collapsed ? 0 : '100%',
    opacity: p.collapsed ? 0 : 1,
    zIndex: 4,
    backgroundColor: theme.palette.neutral.main,
    transition: p.collapsed
      ? `
      height ${theme.transitions.duration.leavingScreen}ms step-end,
      opacity ${theme.transitions.duration.leavingScreen}ms ${theme.transitions.easing.easeInOut}
    `
      : `
      height ${theme.transitions.duration.leavingScreen}ms step-start,
      opacity ${theme.transitions.duration.leavingScreen}ms ${theme.transitions.easing.easeInOut}
    `,

    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  }),
  handle: (p) => ({
    [theme.breakpoints.down(p.desktopControls ? 'xl' : 'sm')]: {
      display: 'flex',
      position: 'absolute',
      alignItems: 'flex-end',
      top: 0,
      left: 0,
      width: p.collapsed ? theme.mixins.panel.width.collapsed : theme.spacing(4),
      height: '100%',
      paddingRight: 0,
      borderLeft: `1px solid ${theme.palette.neutral.light}`,
      backgroundColor: 'white',
      cursor: p.desktopControls && p.disableDesktopControls ? 'not-allowed' : p.collapsed ? 'w-resize' : 'e-resize',
      zIndex: 1,
      transition: theme.transitions.create(['border', 'background', 'padding'], { duration: theme.transitions.duration.shorter }),

      '&:after': {
        content: '""',
        position: 'absolute',
        top: 'calc(50% - 10px)',
        left: p.collapsed ? -2 : -5,
        width: 10,
        height: 10,
        border: `0 solid ${theme.palette.neutral.lighter}`,
        borderTopWidth: '2px',
        borderLeftWidth: '2px',
        opacity: 0,
        transform: p.collapsed ? 'rotate(-45deg)' : 'rotate(135deg)',
        transition: theme.transitions.create(['opacity', 'left', 'padding'], { duration: theme.transitions.duration.shorter }),
      },

      '&:hover': {
        ...(!p.disableDesktopControls && {
          borderLeftColor: theme.palette.neutral.medium,
          backgroundColor: p.collapsed ? theme.palette.grey['50'] : 'white',
          paddingRight: theme.spacing(0.5),

          '&:after': {
            opacity: 1,
            left: p.collapsed ? -10 : 0,
          },
        }),
      },
    },

    [theme.breakpoints.down('xs')]: {
      top: 'auto',
      right: '100%',
      bottom: 100,
      left: 'auto',
      width: p.collapsed ? theme.spacing(6) : theme.spacing(4),
      height: theme.spacing(8),
      borderTopLeftRadius: 8,
      borderBottomLeftRadius: 8,
      border: '1px solid',
      borderColor: p.collapsed ? theme.palette.grey.A100 : theme.palette.grey.A200,
      borderRight: 0,
      boxShadow: '-1px 0px 1px 0 rgba(0,0,0,0.12)',
      transition: theme.transitions.create(['width']),

      '&:after': {
        display: 'none',
      },
    },

    [theme.breakpoints.up('md')]: {
      display: p.desktopControls ? 'flex' : 'none',
    },
  }),
  handleBtn: (p) => ({
    margin: '10px auto',
    width: 42,
    height: 42,
    lineHeight: 1,

    [theme.breakpoints.only('sm')]: {
      display: p.collapsed ? 'block' : 'none',

      '&:hover': {
        '& > span': {
          marginRight: p.collapsed ? theme.spacing(1) : 0,
        },
      },
    },

    [theme.breakpoints.down('xs')]: {
      width: '100%',
      height: '100%',
      minWidth: `${theme.spacing(4)}px !important`,
      margin: 0,
      backgroundColor: 'transparent !important',
    },

    [theme.breakpoints.up('md')]: {
      ...(p.desktopControls && {
        display: p.collapsed ? 'block' : 'none',

        '&:hover': {
          '& > span': {
            marginRight: p.collapsed ? theme.spacing(1) : 0,
          },
        },
      }),
    },

    '& > span': {
      display: 'flex',
      alignItems: 'center',

      [theme.breakpoints.down('xs')]: {
        marginLeft: p.collapsed ? 0 : theme.spacing(1),
      },

      [theme.breakpoints.up('md')]: {
        ...(p.desktopControls && {
          marginLeft: p.collapsed ? 0 : theme.spacing(0.25),
          transition: theme.transitions.create(['margin'], { duration: theme.transitions.duration.shorter }),
        }),
      },
    },
  }),
  handleIcon: (p) => ({
    transform: 'scaleX(1)',
    fontSize: '1.5rem',

    [theme.breakpoints.down(p.desktopControls ? 'xl' : 'sm')]: {
      transform: p.collapsed ? 'scaleX(-1)' : 'none',
    },
  }),
  panel: {
    [theme.breakpoints.down('sm')]: {
      position: 'absolute',
      top: 0,
      right: 0,
      width: 320,
      height: '100%',
      boxShadow: `-1px 0px 2px 0px ${theme.palette.neutral.light}, -2px 0px 2px 0px ${theme.palette.neutral.lighter}`,
    },
  },
  panelSidebar: (p) => ({
    [theme.breakpoints.down(p.desktopControls ? 'xl' : 'sm')]: {
      borderTop: 0,
    },
  }),
  content: {
    flex: '1 1 auto',
  },
  footer: {
    flex: '0 0 auto',
  },
});

export default styles;
