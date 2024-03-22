const styles = (theme) => ({
  wrapper: {
    marginTop: 30,
  },
  actionButton: {
    marginLeft: theme.spacing(1),
  },
  tableContainer: {
    maxHeight: '440px',
  },
  row: {
    cursor: 'pointer',
    '&.active': {
      backgroundColor: theme.palette.grey[300],
    },
  },
  rowSelected: {
    background: theme.palette.grey[100],
  },
  colSelected: {
    background: theme.palette.grey[300],
  },
  colBorder: {
    borderLeft: `4px solid ${theme.palette.grey[600]}`,
  },
  tableHead: {
    zIndex: '10',
    position: 'sticky',
    top: 0,
    '& th': {
      fontWeight: theme.typography.fontWeightBold,
      fontSize: theme.typography.pxToRem(12),
      // border: 0,
      // borderBottom: `1px solid ${theme.palette.neutral.light}`,
      // borderTop: `1px solid ${theme.palette.neutral.light}`,
    },
  },
  tableCell: {
    width: '85px',
    position: 'relative',
    // border: 0,
  },
  tableFirstCell: {
    width: '200px',
    // border: 0,
  },
});

export default styles;
