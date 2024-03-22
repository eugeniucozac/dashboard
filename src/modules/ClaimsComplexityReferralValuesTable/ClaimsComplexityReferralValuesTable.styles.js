const styles = (theme) => ({
  search: {
    maxWidth: '100%!important',
    marginBottom: theme.spacing(1),
  },
  tableWrapper: {
    marginLeft: 0,
  },
  searchWrapper: {
    marginTop: theme.spacing(1.5),
  },
  tableHead: {
    '& th': {
      paddingTop: 0,
      border: 'none',
      fontSize: theme.typography.pxToRem(11.5),
    },
  },
  radio: {
    padding: 0,
    position: 'absolute',
    left: '-2.5px',
    top: '8px',
  },
  tableRowActive: {
    background: theme.palette.grey[100],
  },
  tableCell: {
    position: 'relative',
    width: '320px',
    maxWidth: '320px',
  },
  tableTitle: {
    marginBottom: 0,
    fontWeight: theme.typography.fontWeightBold,
  },
  confirmButton: {
    marginTop: theme.spacing(1),
    marginLeft: theme.spacing(3),
  },
  padding: {
    height: theme.spacing(40),
  },
  title: {
    padding: theme.spacing(0.5, 0),
    textTransform: 'uppercase',
    fontWeight: theme.typography.fontWeightBold,
    fontSize: theme.typography.pxToRem(14),
  },
});

export default styles;
