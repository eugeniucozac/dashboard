const styles = (theme) => ({
  pageContainer: {
    maxWidth: 1400,
    width: '100%',
    marginLeft: 'auto',
    marginRight: 'auto',
    border: `1px solid ${theme.palette.neutral.light}`,
    borderTop: 0,
  },
  row: {
    cursor: 'pointer',
  },
  rowSelected: {
    background: theme.palette.grey[100],
    cursor: 'default',
  },
  sectionHeader: {
    marginBottom: `${theme.spacing(0)}px!important`,
  },
  searchBox: {
    marginBottom: theme.spacing(2),
  },
  headerContent: {
    display: 'flex',
    alignItems: 'flex-start',
  },
  button: {
    marginLeft: theme.spacing(1.5),
  },
  rowNew: {
    ...theme.mixins.row.new,
  },
  rowNewSelected: {
    ...theme.mixins.row.newSelected,
  },
  dataCellLast: {
    borderTop: '1px solid #eeeeee',
  },
  searchBoxContainer: {
    justify: 'flex-end',
  },
});

export default styles;
