const styles = (theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    minHeight: theme.mixins.page.header.height,
    padding: theme.spacing(3),
    paddingTop: 6,
    paddingBottom: 6,
    marginBottom: theme.spacing(3),
    borderBottom: `1px solid ${theme.palette.neutral.light}`,
    ...theme.mixins.overflowPanel,

    [theme.breakpoints.up('sm')]: {
      paddingLeft: theme.spacing(5),
      paddingRight: theme.spacing(5),
    },

    [theme.breakpoints.up('lg')]: {
      flexWrap: 'nowrap',
    },
  },
  logo: {
    flex: '0 1 auto',
    marginTop: 13, //vertically center logo
    marginRight: theme.spacing(4),
  },
  info: {
    flex: '1 1 auto',
    display: 'flex',
    flexWrap: 'wrap',
    marginTop: 8,
    marginBottom: 8,
    marginLeft: -12,
    marginRight: -12,

    [theme.breakpoints.up('sm')]: {
      flexWrap: 'nowrap',
    },
  },
  box: {
    minWidth: 120,
    padding: 12,
    paddingBottom: 4,
    transition: theme.transitions.create(['padding-bottom']),

    [theme.breakpoints.up('md')]: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
    },
  },
  details: {
    minWidth: 'auto !important',
  },
  image: {
    display: 'block',
    maxHeight: 48,
    maxWidth: 250,
  },
  imageMissing: {
    width: 44,
    height: 'auto',
    marginTop: -8,
    color: theme.palette.neutral.light,
  },
});

export default styles;
