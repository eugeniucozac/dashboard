const styles = (theme) => ({
  title: {
    padding: theme.spacing(0.5, 0),
    textTransform: 'uppercase',
    fontWeight: theme.typography.fontWeightBold,
    fontSize: theme.typography.pxToRem(14),
  },
  tableHead: {
    '& th': {
      paddingTop: 0,
      border: 'none',
      fontSize: theme.typography.pxToRem(11.5),
    },
  },
  tableCell: {
    paddingLeft: '32px!important',
    position: 'relative',
  },
  radio: {
    padding: 0,
    position: 'absolute',
    left: '-2.5px',
    top: '8px',
  },
  selectAutocomplete: {
    '& .MuiInputBase-root': {
      height: '32px',
      alignContent: 'center',
      marginRight: '32px',
    },
  },
  filterBox: {
    height: '30px',
    display: 'flex',
    alignItems: 'center',
  },
  searchMaxWidth: {
    maxWidth: '98% !important',
    minWidth: '45% !important',
    width: '70% !important',
    marginLeft: '1% !important',
    justifyContent: 'flex-start !important',
  },
});

export default styles;
