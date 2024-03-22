const styles = (theme) => ({
  row: {
    cursor: 'pointer',

    '&.active': {
      backgroundColor: theme.palette.grey[300],
    },
  },
  rowSelected: {
    background: theme.palette.grey[100],
  },
  checkbox: {
    padding: '0 !important',
  },
  dateAlert: {
    color: theme.palette.error.main,
  },
  description: {
    minWidth: theme.spacing(26),
  },
});

export default styles;
