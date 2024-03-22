const styles = (theme) => ({
  root: ({ expandedState }) => ({
    borderBottom: expandedState ? `0` : `1px solid ${theme.palette.neutral.light}`,
    width: '100%',
    height: 60,
    zIndex: 100,
    position: 'relative',
    backgroundColor: 'white',
    padding: `0px ${theme.spacing(3)}px`,
    [theme.breakpoints.up('sm')]: {
      padding: `0px ${theme.spacing(3)}px`,
    },
    display: 'flex',
    flexDirection: 'column',
    flex: '1 1 100%',
    justifyContent: 'center',
  }),
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'nowrap',
    margin: 0,
    transition: theme.transitions.create('margin'),
    zIndex: 100,
    backgroundColor: 'white',
  },
  headerCollapsed: {
    [theme.breakpoints.up('sm')]: {
      marginBottom: 0,
    },
  },
  headerContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'start',
    flex: '1 1 100%',
    maxWidth: 'calc(100% - 66px)',
    minWidth: 0, // flexbox nowrap
    marginRight: theme.spacing(1),
  },
  headerActions: {
    flex: '0 1 auto',
    display: 'flex',
    flexWrap: 'nowrap',
    zIndex: 1,
    backgroundColor: '#ffffff',
    margin: `${theme.spacing(0)}px ${theme.spacing(-1.5)}px 0 ${theme.spacing(2)}px`,
    [theme.breakpoints.up('sm')]: {
      marginRight: -theme.spacing(2),
    },
  },
  headerActionsCollapsed: {
    pointerEvents: 'none',
  },
  toggleIcon: {
    transition: theme.transitions.create('transform'),
  },
  toggleIconCollapsed: {
    transform: 'scaleY(-1)',
  },
  headerTitle: ({ expandedState }) => ({
    margin: 0,
    marginLeft: theme.spacing(3),
    marginRight: theme.spacing(3),
    fontSize: theme.typography.pxToRem(18),
    fontWeight: theme.typography.fontWeightRegular,
    cursor: 'pointer',
    transition: theme.transitions.create('margin'),
    maxWidth: expandedState ? 'auto' : 600,
    ...theme.mixins.ellipsis,
  }),
  title: {
    flex: '1 1 auto',
    display: 'flex',
    marginBottom: theme.spacing(1),
    fontSize: theme.typography.pxToRem(14),
    transition: theme.transitions.create('margin'),
    ...theme.mixins.breakword,
    [theme.breakpoints.up('sm')]: {
      fontSize: theme.typography.pxToRem(18),
    },
  },
  titleCollapsed: {
    marginBottom: theme.spacing(0.5),

    [theme.breakpoints.up('sm')]: {
      marginBottom: theme.spacing(0.5),
    },
  },
  subtitle: {
    display: 'flex',
    marginBottom: theme.spacing(0.5),
    transition: theme.transitions.create('margin'),
    ...theme.mixins.breakword,
  },
  subtitleCollapsed: {
    marginBottom: 0,
  },
  description: {
    ...theme.mixins.breakword,
  },
  info: {
    marginTop: theme.spacing(1.5),
  },
  paper: {
    zIndex: 99,
    position: 'relative',
    padding: theme.spacing(3),
    flex: '1 1 100%',
    borderRadius: '0 0 3px 3px',
    marginTop: -2,
    '&:before': {
      content: ' ',
      position: 'absolute',
      left: 0,
      top: -2,
      width: '100%',
      height: 10,
      backgroundColor: 'red',
    },
  },
});

export default styles;
