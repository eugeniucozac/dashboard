const styles = (theme) => ({
  claimTitle: {
    textTransform: 'uppercase',
    fontWeight: theme.typography.fontWeightBold,
    fontSize: theme.typography.pxToRem(14),
  },
  title: {
    fontSize: theme.typography.fontSize,
    fontWeight: theme.typography.fontWeightMedium,
  },
  tt: {
    width: '30%',
  },
  dt: {
    width: '70%',
  },
  subTitle: {
    textTransform: 'uppercase',
    fontWeight: theme.typography.fontWeightBold,
    fontSize: theme.typography.pxToRem(14),
    margin: `${theme.spacing(2, 0)} !important`,
  },
  sectionDetail: {
    margin: `${theme.spacing(2, 0)} !important`,
  },
  labelRightAlign: {
    textAlign: 'right',
    cursor: 'pointer',
  },
  label: {
    fontWeight: theme.typography.fontWeightMedium,
  },
  docTitle: {
    color: 'blue',
  },
  wrapper: {
    marginTop: theme.spacing(2),
  },
  titleLink: {
    textTransform: 'none',
    marginLeft: theme.spacing(2),
    color: 'blue',
    '&:hover': {
      textDecoration: 'none!important',
    },
  },
  claimant: {
    wordBreak: 'break-all',
  },
  settlementCurr: {
    '& p': {
      marginTop: '10px',
    },
  },
  ugHeaderSection: {
    borderTop: `1px solid ${theme.palette.neutral.light}`,
  },
});

export default styles;
