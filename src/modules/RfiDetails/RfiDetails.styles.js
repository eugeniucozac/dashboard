const styles = (theme) => ({
  root: {
    boxShadow: 'none',
  },
  title: {
    marginTop: theme.spacing(6),
    padding: theme.spacing(1.5),
    textTransform: 'uppercase',
    fontWeight: theme.typography.fontWeightBold,
    fontSize: theme.typography.pxToRem(14),
  },
  subTitle: {
    textTransform: 'uppercase',
    fontWeight: theme.typography.fontWeightBold,
    fontSize: theme.typography.pxToRem(14),
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
  titleLink: {
    textTransform: 'none',
    color: 'blue!important',
    fontWeight: theme.typography.fontWeightMedium,
    '&:hover': {
      textDecoration: 'none!important',
    },
  },
  cardHeader: {
    padding: theme.spacing(0),
    marginBottom: theme.spacing(1),
    marginTop: theme.spacing(2),
  },
  cardContent: {
    paddingLeft: 0,
    paddingRight: 0,
    marginBottom: theme.spacing(1),
  },
  alignCenter: {
    alignItems: 'center',
  },
  historyGrid: {
    marginLeft: theme.spacing(3),
    borderBottom: `1px solid ${theme.palette.grey[300]}`,
  },
  userName: {
    fontWeight: theme.typography.fontWeightMedium,
    fontSize: theme.typography.pxToRem(14),
    marginRight: theme.spacing(3),
    color: theme.palette.neutral.darkest,
  },
  queryDate: {
    fontSize: theme.typography.pxToRem(12),
    color: theme.palette.neutral.dark,
  },
  queryDescription: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(2),
  },

  infoCardContainerWrapper: {
    marginLeft: theme.spacing(4.5),
  },
  infoCardContainer: {
    display: 'flex',
    flexFlow: 'row wrap',
    width: '100%',
    alignContent: 'space-around',
  },
  infoCard: {
    width: '30%',
    margin: theme.spacing(1.25),
  },
  infoCardTitle: {
    fontWeight: 600,
    textAlign: 'left',
    margin: theme.spacing(0, 0, 1.25, 0),
    color: 'rgba(0, 0, 0, 0.87)!important',
  },
  infoCardValue: {
    textAlign: 'left',
    margin: theme.spacing(0, 0, 0, 0.25),
    color: 'inherit!important',
    fontWeight: 400,
  },
  documentsLoaderContainer: {
    width: '100%',
  },
  uploadedDocumentContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 20%)',
    marginBottom: theme.spacing(1),
    width: '93%',
  },
  expandBtn: {
    paddingTop: theme.spacing(1),
  },
  collapseBtn: {
    position: 'relative',
    '& a': {
      position: 'absolute',
      bottom: theme.spacing(1.5),
      whiteSpace: 'nowrap',
    },
  },
});

export default styles;
