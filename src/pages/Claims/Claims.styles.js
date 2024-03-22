const styles = (theme) => ({
  row: {
    cursor: 'pointer',
  },
  rowSelected: {
    background: theme.palette.grey[100],
  },
  rowNew: {
    ...theme.mixins.row.new,
  },
  rowNewSelected: {
    ...theme.mixins.row.newSelected,
  },
  headerContent: {
    display: 'flex',
    alignItems: 'flex-start',
  },
  headerButtons: {
    [theme.breakpoints.up('sm')]: {
      flex: '1 0 60% !important',
    },
  },
  button: {
    marginLeft: theme.spacing(1.5),
  },
});

export default styles;
