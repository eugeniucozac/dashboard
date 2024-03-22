const styles = (theme) => ({
  paper: {
    display: 'flex',
    overflowY: 'auto',
    minHeight: 80,
    maxHeight: 'calc(80vh - 100px)',

    [theme.breakpoints.up('sm')]: {
      maxHeight: 'calc(85vh - 40px)',
    },
  },
  link: {
    paddingLeft: 6,
    marginLeft: -6,
  },
  linkText: {
    fontSize: theme.typography.pxToRem(12),

    '& strong': {
      fontWeight: theme.typography.fontWeightMedium,
      color: theme.palette.neutral.darkest,
    },
  },
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',

    [theme.breakpoints.down('sm')]: {
      flexWrap: 'wrap',
    },
  },
  group: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    padding: theme.spacing(3),
    paddingTop: theme.spacing(1.5),
    paddingBottom: theme.spacing(1.5),

    '&:first-child': {
      paddingTop: theme.spacing(3),
    },

    '&:last-child': {
      paddingBottom: theme.spacing(3),
    },

    [theme.breakpoints.up('md')]: {
      width: '50%',
      padding: theme.spacing(3),
      paddingLeft: theme.spacing(1.5),
      paddingRight: theme.spacing(1.5),
      overflowY: 'auto',

      '&:first-child': {
        paddingLeft: theme.spacing(3),
      },

      '&:last-child': {
        paddingRight: theme.spacing(3),
      },
    },
  },
  category: {
    '&:last-child': {
      marginBottom: 0,
    },
  },
  categoryTitle: {
    display: 'flex',
  },
  categoryName: {
    flex: '0 1 auto',
  },
  categorySeeAll: {
    flex: '1 0 auto',
    fontSize: theme.typography.pxToRem(10),
    color: theme.palette.secondary.main,
    marginLeft: theme.spacing(1),
    lineHeight: 1.8,
  },
  categorySeeAllLink: {
    textDecoration: 'none',
    color: theme.palette.secondary.main,

    '&:hover': {
      textDecoration: 'underline',
    },
  },
  noResult: {
    fontSize: theme.typography.pxToRem(12),
    color: theme.palette.neutral.medium,
    paddingTop: theme.spacing(1.5),
    textAlign: 'center',
  },
  error: {
    flex: 1,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    fontSize: theme.typography.pxToRem(11),
    color: theme.palette.error.main,
    textAlign: 'center',
  },
  logo: {
    display: 'block',
    width: 'auto',
    height: 'auto',
    maxWidth: '100%',
    maxHeight: 14,
    marginRight: 12,
  },
});

export default styles;
