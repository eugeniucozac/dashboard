const styles = (theme) => ({
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
  switch: {
    marginTop: '0 !important',
    padding: '0 !important',
    marginLeft: 10,
  },
});

export default styles;
