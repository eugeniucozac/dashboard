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
    paddingLeft: theme.spacing(0),
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
    marginTop: theme.spacing(2),
  },
  cardContent: {
    paddingLeft: 0,
    paddingRight: 0,
    marginBottom: theme.spacing(1),
  },
  taskSnapshot: {
    background: theme.palette.grey[100],
  },
  radioLabel: {
    marginTop: theme.spacing(0),
    fontWeight: `${theme.typography.fontWeightBold} !important`,
  },
  viewLabel: {
    marginTop: `${theme.spacing(1)}px !important`,
    fontWeight: theme.typography.fontWeightBold,
    marginRight: '1.5rem',
  },
  sanctionCheckLabel: {
    marginTop: `${theme.spacing(0.75)}px !important`,
    fontWeight: theme.typography.fontWeightBold,
    marginRight: '1.5rem',
    fontSize: theme.typography.pxToRem(14),
  },
  commmentsLabel: {
    fontSize: '0.8125rem',
    fontWeight: theme.typography.fontWeightBold,
  },
  sanctionCheckContainer: {
    justifyContent: 'left !important',
    margin: theme.spacing(1.5, 0),
  },
  tableToolbar: {
    justifyContent: 'left !important',
  },
  gridContainer: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: theme.palette.grey[100],
  },
  nextActionBtn: {
    marginRight: theme.spacing(1.5),
    padding: '8px 12px',
    '& button': {
      background: theme.palette.common.white,
      '&:hover': {
        textDecoration: 'none!important',
        background: theme.palette.grey[100],
      },
    },
  },
  taskDetailsInfo: {
    margin: theme.spacing(2.5, 0),
  },
  taskDetailsInfoCards: {
    marginLeft: theme.spacing(2.5),
  },
  commmentsContainer: {
    marginLeft: theme.spacing(4),
  },
  notesContainer: {
    margin: theme.spacing(4, 0),
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
  underWritingContainer: {
    width: '100%',
  },
  underWritingCardContainer: {
    margin: theme.spacing(3, 0.25),
  },
  button: {
    margin: '0 5px',
  },
  fotterButtonGroup: {
    margin: theme.spacing(1.5, 1),
    display: 'flex',
    justifyContent: 'end',
  },
  descriptionInfo: {
    width: '30%',
  },
});

export default styles;
