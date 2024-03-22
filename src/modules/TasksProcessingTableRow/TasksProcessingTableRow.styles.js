const styles = (theme) => ({
  row: {
    cursor: 'pointer',

    '&.active': {
      backgroundColor: theme.palette.grey[300],
    },
  },
  checkBoxSelected: {
    background: theme.palette.grey[100],
  },
  rowSelected: {
    background: theme.palette.grey[300],
  },
  checkbox: {
    padding: '0 !important',
  },
  rejected: {
    color: theme.palette.error.main,
  },
  description: {
    minWidth: theme.spacing(26),
  },
  dateAlert: {
    color: theme.palette.error.main,
  },
  styickyColumnRight: {
    position: 'sticky',
    right: 0,
    background: theme.palette.grey[100],
    zIndex: '2',
  },
  styickyColumnLeft: {
    position: 'sticky',
    left: 0,
    background: theme.palette.grey[100],
    zIndex: '2',
  },
  assigneeLink: {
    fontSize: theme.typography.pxToRem(10),
    display: 'flex',
    justifyContent: 'end',
  },
});

export default styles;
