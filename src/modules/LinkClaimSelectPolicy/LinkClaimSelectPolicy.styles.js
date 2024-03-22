const styles = (theme) => ({
  radio: {
    padding: 4,
    margin: '-8px 4px -8px 0',
  },
  filtersContainer: {
    width: '50% !important',
    maxWidth: '640px !important',
    marginBottom: theme.spacing(2),
  },
  filterBox: {
    flex: '1 1 40%',
    height: '12px',
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
