const styles = (theme) => ({
  sticky: {
    padding: theme.spacing(3),
    paddingTop: theme.spacing(2),
    ...theme.mixins.overflowPanel,
    marginTop: -theme.spacing(2),

    [theme.breakpoints.up('sm')]: {
      padding: theme.spacing(5),
      paddingBottom: theme.spacing(2),
      paddingTop: theme.spacing(2),
      marginTop: -theme.spacing(2),
    },
  },
  premiumByCurrency: {
    margin: `-4px 0 0 0`,
    lineHeight: 1.4,
    padding: 0,
    fontSize: theme.typography.pxToRem(11.5),
    '& li': {
      listStyle: 'none',
    },
  },
  tabs: {
    marginTop: theme.spacing(5),
  },
  filterGroup: {
    display: 'flex',
    flexWrap: 'wrap',
    marginBottom: theme.spacing(-2),

    [theme.breakpoints.up('lg')]: {
      flexWrap: 'nowrap',
    },
  },
  filter: {
    marginRight: theme.spacing(5),
    marginBottom: theme.spacing(2),
    minWidth: '20%',
    maxWidth: '100%',

    '&:last-child': {
      marginRight: 0,
    },
  },
  content: {
    marginTop: theme.spacing(5),

    [theme.breakpoints.up('sm')]: {
      marginTop: theme.spacing(7),
    },
  },
  avatars: {
    marginTop: -1,
    marginBottom: -7,
  },
  card: {
    marginRight: 4,
  },
  clientName: {
    color: theme.palette.neutral.dark,
  },
});

export default styles;
