const styles = (theme) => ({
  root: {
    padding: theme.spacing(2, 2),
    overflowY: 'auto',
    '& tr:last-of-type td': {
      borderBottom: 'none',
    },
  },
  tableTitle: {
    fontSize: theme.typography.pxToRem(14),
    fontWeight: theme.typography.fontWeightBold,
    textTransform: 'uppercase',
  },
  radio: {
    padding: 0,
  },
  tableHead: {
    '& th': {
      fontWeight: theme.typography.fontWeightBold,
      fontSize: theme.typography.pxToRem(12),
    },
  },
});

export default styles;
