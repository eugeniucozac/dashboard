const styles = (theme) => ({
  requiredFieldsText: {
    textAlign: 'right',
  },
  claimsContainer: {
    padding: theme.spacing(1, 0.5),
    borderTop: `1px solid ${theme.palette.neutral.light}`,
  },
  title: {
    paddingTop: theme.spacing(1),
    textTransform: 'uppercase',
    fontWeight: theme.typography.fontWeightBold,
    fontSize: theme.typography.pxToRem(14),
  },
  wrapper: {
    margin: theme.spacing(0, 5, 5, 5),
  },
  formInput: {
    '& input': {
      paddingTop: '9.5px',
      paddingBottom: '7.5px',
    },
  },
  radioLabel: {
    '& label span:last-of-type': {
      fontWeight: 600,
      fontSize: '0.75rem!important',
      color: 'rgba(0, 0, 0, 0.87) !important',
    },
    marginTop: '0px !important',
  },
});

export default styles;
