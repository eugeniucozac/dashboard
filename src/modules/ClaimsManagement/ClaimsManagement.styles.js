const styles = (theme) => ({
  searchInput: {
    flex: '1 1 auto',
  },
  searchSort: {
    cursor: 'pointer',
    margin: theme.spacing(1),
  },
  searchFilter: {
    cursor: 'pointer',
    margin: theme.spacing(1),
  },
  search: {
    maxWidth: '60%!important',
  },
  searchMaxWidth: {
    maxWidth: '90% !important',
    minWidth: '45% !important',
    width: '50% !important',
    marginLeft: '1% !important',
  },
  filterBox: {
    height: '30px',
    display: 'flex',
    alignItems: 'center',
  },
  radioLabel: {
    marginTop: '0px !important',
  },
  viewLabel: {
    marginTop: '8px!important',
    fontWeight: 800,
    marginRight: '1.5rem',
  },
  optionValue: {
    height: '30px',
  },
  selectAutocomplete: {
    '& .MuiInputBase-root': {
      height: '32px',
      alignContent: 'center',
      marginRight: '32px',
    },
  },
});

export default styles;
