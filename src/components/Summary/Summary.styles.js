const styles = (theme) => ({
  root: {
    padding: `${theme.spacing(3) - theme.spacing(0.5)}px ${theme.spacing(3)}px`,

    [theme.breakpoints.up('sm')]: {
      padding: theme.spacing(5),
    },
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'nowrap',
    margin: 0,
    marginBottom: theme.spacing(0.5),
    transition: theme.transitions.create('margin'),

    [theme.breakpoints.up('sm')]: {
      marginBottom: theme.spacing(2),
    },
  },
  headerCollapsed: {
    [theme.breakpoints.up('sm')]: {
      marginBottom: theme.spacing(1),
    },
  },
  headerContent: {
    flex: '1 0 auto',
    minWidth: 0, // flexbox nowrap
    marginRight: theme.spacing(1),
  },
  headerActions: {
    flex: '0 1 auto',
    display: 'flex',
    flexWrap: 'nowrap',
    margin: `${theme.spacing(-0.5)}px ${theme.spacing(-1.5)}px 0 auto`,

    [theme.breakpoints.up('sm')]: {
      marginTop: -2,
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
  title: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'nowrap',
    marginBottom: theme.spacing(1),
    transition: theme.transitions.create('margin'),
  },
  titleCollapsed: {
    marginBottom: theme.spacing(0.5),
  },
  titleContent: {
    flex: '1 1 auto',
    display: 'flex',
    fontSize: theme.typography.pxToRem(18),
    marginBottom: theme.spacing(0),
    ...theme.mixins.breakword,
  },
  titleAction: {
    flex: '0 1 auto',
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
});

export default styles;
