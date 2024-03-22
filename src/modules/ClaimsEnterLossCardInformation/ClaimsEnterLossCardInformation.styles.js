const styles = (theme) => ({
  root: {
    boxShadow: 'none',
  },
  title: {
    marginTop: theme.spacing(6),
    paddingBottom: theme.spacing(0.5),
    textTransform: 'uppercase',
    fontWeight: theme.typography.fontWeightBold,
    fontSize: theme.typography.pxToRem(14),
  },
  subTitle: {
    textTransform: 'uppercase',
    fontWeight: theme.typography.fontWeightBold,
    fontSize: theme.typography.pxToRem(14),
  },
  titleLink: {
    textTransform: 'none',
    marginLeft: theme.spacing(2),
    color: 'blue',
    '&:hover': {
      textDecoration: 'none!important',
    },
  },
  titleRequired: {
    textTransform: 'none',
    float: 'right',
    fontSize: theme.typography.pxToRem(12),
    fontWeight: theme.typography.fontWeightLight,
  },
  details: {
    display: 'flex',
    flexWrap: 'wrap',
    '& > div': {
      flex: '1 0 33.33%',
    },
  },
  cardHeader: {
    padding: theme.spacing(0),
    marginBottom: theme.spacing(1),
  },
  cardContent: {
    paddingLeft: 0,
    paddingRight: 0,
  },
});

export default styles;
