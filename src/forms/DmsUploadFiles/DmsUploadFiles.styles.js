const styles = (theme) => ({
  root: {
    '& > *': {
      borderBottom: 'unset',
    },
  },
  subTitle: {
    fontWeight: theme.typography.fontWeightBold,
    fontSize: theme.typography.pxToRem(14),
    paddingBottom: theme.spacing(1),
    paddingTop: theme.spacing(1),
    paddingLeft: theme.spacing(0.5),
  },
  boxView: {
    padding: theme.spacing(1.5),
    border: `1px solid ${theme.palette.grey[200]}`,
  },
  cellWidth: {
    width: '25%',
    paddingLeft: 0,
  },
  iconSuccess: {
    color: theme.palette.success.dark,
  },
  btnRetry: {
    textTransform: 'capitalize',
    textDecoration: 'underline',
    fontSize: theme.typography.pxToRem(12),
  },
  datepicker: {
    '& > div': {
      color: theme.palette.neutral.dark,
    },
  },
  selectText: {
    fontSize: theme.typography.pxToRem(11),
    fontWeight: theme.typography.fontWeightBold,
    marginLeft: theme.typography.pxToRem(5),
  },
  formAuto: {
    width: '25%',
  },
});

export default styles;
