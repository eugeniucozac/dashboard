const styles = (theme) => ({
  splitAsContainer: {
    width: '100%',
    border: '1px solid #0000001f',
  },
  datePickerLabel: {
    fontSize: theme.typography.pxToRem(12),
    fontWeight: theme.typography.fontWeightRegular,
    marginLeft: 'auto',
  },
  datePickerInput: {
    textAlign: 'right',
  },
  brokerage: {
    fontSize: theme.typography.pxToRem(13),
    fontWeight: theme.typography.fontWeightMedium,
  },
  total: {
    fontSize: theme.typography.pxToRem(13),
    fontWeight: theme.typography.fontWeightMedium,
  },
  subTitle: {
    fontWeight: theme.typography.fontWeightBold,
    fontSize: theme.typography.pxToRem(14),
  },
  errorMessage: {
    fontSize: theme.typography.pxToRem(10),
    color: theme.palette.error.main,
  },
  formErrorMessage: {
    display: 'flex',
    justifyContent: 'center',
    position: 'sticky',
    top: theme.spacing(1),
    zIndex: 9,
  },
});

export default styles;
