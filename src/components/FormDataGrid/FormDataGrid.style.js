const styles = (theme) => ({
  root: {
    width: '100%',
  },
  table: { width: '100%', tableLayout: 'fixed', border: '1px solid rgba(224, 224, 224, 1)', borderRadius: '4px' },
  tableHeadCell: {
    borderBottom: `1px solid ${theme.palette.grey[300]}`,
  },
  tableHead: {
    fontWeight: 700,
  },
  sizeSmall: {
    padding: '5px 0',
    paddingRight: 4,

    '&:first-child': {
      paddingLeft: 4,
    },

    '&:last-child': {
      paddingRight: 4,
    },
  },
  copyBtn: {
    border: 'none',
  },
});

export default styles;
