const styles = (theme) => ({
  viewLabel: {
    marginRight: theme.spacing(1.5),
    fontWeight: theme.typography.fontWeightBold,
  },
  radioContainer: {
    display: 'flex',
    alignItems: 'center',
    marginRight: theme.spacing(2),
    marginBottom: theme.spacing(2),
    paddingTop: 2,

    '& .MuiFormGroup-row .MuiFormControlLabel-label': {
      fontSize: theme.typography.pxToRem(12),
    },

    '& .MuiFormGroup-row .MuiFormControlLabel-root': {
      marginTop: -6,
      marginBottom: -6,

      '&:not(:last-child)': {
        marginRight: theme.spacing(2),
      },
    },
  },
  radioGroup: {
    padding: '0 !important',
    margin: '0 !important',
  },
  filtersContainer: {
    width: '50% !important',
    maxWidth: '480px !important',
    marginBottom: theme.spacing(2),
  },
  filterBox: {
    flex: '1 1 40%',
    height: '30px',
    display: 'flex',
    alignItems: 'center',
  },
  searchBox: {
    flex: '1 1 60%',
    minWidth: 'auto !important',
    maxWidth: 'none !important',
    width: 'auto !important',
    marginLeft: `${theme.spacing(0.5)}px !important`,

    '& button[type="submit"]': {
      height: '30px',
    },
  },
  selectAutocomplete: {
    width: '100%',
    height: '31px',
    '& .MuiInputBase-root': {
      height: '30px',
      alignContent: 'center',
    },
  },
});

export default styles;
