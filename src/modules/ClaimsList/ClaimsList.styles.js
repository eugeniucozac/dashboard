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
    maxWidth: '40%!important',
  },
  searchMaxWidth: {
    maxWidth: '480px !important',
  },
  searchLeft: {
    marginLeft: '20px !important',
  },
  searchBox: {
    flexDirection: 'row',
    display: 'flex',
    justifyContent: 'flex-end',
    marginRight: '68px',
    marginBottom: '-28.8px',
  },
  searchPopoverFrame: {
    maxHeight: 'calc(100% - 40px)',
    display: 'flex',
    flexDirection: 'row',
    width: '450px',
    '& form': {
      marginTop: 0,
    },
  },
  searchContainer: {
    margin: theme.spacing(0.75, 0.75, 0.75, -1.5),
    flex: '1',
    direction: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default styles;
