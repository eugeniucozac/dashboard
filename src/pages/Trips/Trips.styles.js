const styles = (theme) => ({
  row: {
    cursor: 'pointer',
  },
  rowSelected: {
    background: theme.palette.grey[100],
  },
  cellName: {
    ...theme.mixins.breakword,
    width: '25%',
  },
});

export default styles;
