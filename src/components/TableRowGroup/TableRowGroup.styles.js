const styles = (theme) => ({
  row: {
    height: 42,
    cursor: 'pointer',
    transition: theme.transitions.create('background-color', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  rowSelected: {
    backgroundColor: theme.palette.grey[100],
  },
  cell: {
    transition: theme.transitions.create('border-color', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  cellExpanded: {
    borderBottomColor: '#ccc',
  },
  title: {
    verticalAlign: 'middle',
  },
  icon: {
    marginLeft: -2,
    marginRight: 6,
    verticalAlign: 'middle',
    transition: theme.transitions.create('transform'),
  },
  iconSelected: {
    transform: 'scaleY(-1)',
  },
  selection: {
    fontSize: theme.typography.pxToRem(12),
    fontStyle: 'italic',
    color: theme.palette.neutral.main,
    paddingLeft: 10,
  },
});

export default styles;
