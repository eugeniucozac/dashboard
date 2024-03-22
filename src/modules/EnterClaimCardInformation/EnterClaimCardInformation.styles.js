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
  cardHeader: {
    padding: theme.spacing(0),
    marginBottom: theme.spacing(1),
  },
  cardContent: {
    paddingLeft: 0,
    paddingRight: 0,
  },
  detailsThree: {
    display: 'flex',
    flexWrap: 'wrap',
    marginTop: theme.spacing(5),
    marginBottom: theme.spacing(3),
    '& > div': {
      flex: '1 0 33.33%',
    },
  },
  detailsTwo: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  fgu: {
    flex: '2 0 1%',
    paddingLeft: theme.spacing(4),
  },
  risk: {
    flex: '1 0 9%',
    paddingLeft: theme.spacing(14),
  },
  detailsCertification: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(4),
    display: 'flex',
    flexWrap: 'wrap',
  },
  certificationRow: {
    flex: 1,
    width: theme.spacing(4),
    '& > div:last > div': {
      marginLeft: '4px',
    },
  },
  rowDetails: {
    height: theme.spacing(6),
    padding: theme.spacing(0),
    marginTop: '11px',
    marginBottom: theme.spacing(1),
  },
  form: {
    marginTop: 0,
  },
  formLabel: {
    fontWeight: 600,
    fontSize: theme.typography.pxToRem(12),
    color: 'rgba(0, 0, 0, 0.87) !important',
  },
  longText: {
    paddingLeft: theme.spacing(0),
  },
  row: {
    position: 'relative',
    '& p': {
      marginTop: '11px',
    },
  },
  link: {
    position: 'absolute',
    top: '28%',
    right: '-16%',
    color: 'rgb(79, 178, 206)!important',
    '&:hover': {
      textDecoration: 'none!important',
    },
  },
  disableLink: {
    position: 'absolute',
    top: '28%',
    right: '-16%',
    color: 'rgb(79, 178, 206)!important',
    opacity: '0.5',
    textDecoration: 'none',
    pointerEvents: 'none',
    cursor: 'default',
  },
  claimantLink: {
    gridArea: 'b',
    marginLeft: '95px',
    marginTop: '10px',
    color: 'rgb(79, 178, 206) !important',
    '&:hover': {
      textDecoration: 'none !important',
    },
  },
  formClaimantSelect: {
    width: '60%',
    gridArea: 'a',
  },
  claimantRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '10px',
    gridAutoRows: '20px',
    gridTemplateAreas: 'a b',
    alignItems: 'start',
    width: '100%',
    marginTop: '-20px',
  },
  claimDiv: {
    width: '120%',
    marginTop: '8px',
  },
  datepicker: {
    '& > div': {
      color: theme.palette.neutral.dark,
    },
  },
  autoFormSelectTxt: {
    padding: '0!important',
  },
  adjusterRadioGroup: {
    '& .MuiFormControlLabel-root': {
      marginRight: '15px',
    },
    '& .MuiFormControlLabel-label': {
      fontSize: '.7rem',
    },
  },
});

export default styles;
