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
  colSelected: {
    background: theme.palette.grey[300],
  },
  colBorder: {
    borderLeft: `4px solid ${theme.palette.grey[600]}`,
  },
  wrapper: {
    marginTop: 30,
  },
  tableHead: {
    '& th': {
      fontWeight: theme.typography.fontWeightBold,
      fontSize: theme.typography.pxToRem(12),
    },
  },
  catCodeDescription: {
    fontSize: theme.typography.pxToRem(12),
    width: '150px',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },
});

export default styles;
