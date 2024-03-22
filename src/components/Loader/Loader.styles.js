const styles = (theme) => ({
  root: (props) => ({
    position: 'fixed',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(255, 255, 255, 0.9)',
    opacity: 0,
    zIndex: -1,
    transition: `
      left ${theme.transitions.duration.leavingScreen}ms,
      z-index ${theme.transitions.duration.leavingScreen}ms step-end,
      opacity ${theme.transitions.duration.leavingScreen}ms ${theme.transitions.easing.easeInOut}
    `,

    ...(props.visible && {
      opacity: 1,
      zIndex: theme.zIndex.loader,
      transition: `
        left ${theme.transitions.duration.leavingScreen}ms,
        z-index ${theme.transitions.duration.enteringScreen}ms step-start,
        opacity ${theme.transitions.duration.enteringScreen}ms ${theme.transitions.easing.easeInOut}
      `,
    }),

    ...(props.absolute && {
      position: 'absolute',
      zIndex: props.visible ? 10 : -1,
    }),

    ...(props.panel && {
      position: 'fixed',
      height: `calc(100vh - ${theme.mixins.header.height}px)`,
      top: theme.mixins.header.height,
      ...(props.navExpanded
        ? { left: `calc(100% - 33.3333% + ${theme.mixins.nav.width.default * 0.3333}px + 1px)` }
        : { left: `calc(100% - 33.3333% + ${theme.mixins.nav.width.collapsed * 0.3333}px + 1px)` }),
      zIndex: props.visible ? 10 : -1,

      [theme.breakpoints.down('sm')]: {
        left: props.sidebarExpanded ? `calc(100% - ${theme.mixins.panel.width.tablet}px)` : '100%',
      },

      [theme.breakpoints.down('xs')]: {
        left: props.sidebarExpanded ? '20%' : '100%',
      },
    }),

    ...(props.inline && {
      position: 'unset',
      zIndex: props.visible ? 10 : -1,
      background: 'none',
      alignItems: 'flex-start',
      height: '15px',
      width: '15px',

      '& > div': {
        height: '15px !important',
        width: '15px !important',
      },
    }),
  }),
  text: {
    display: 'block',
    maxWidth: 280,
    marginTop: theme.spacing(1),
    color: theme.palette.primary.hint,
  },
});

export default styles;
