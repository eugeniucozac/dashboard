const styles = (theme) => ({
  cellName: {
    ...theme.mixins.breakword,
    width: '25%',
  },
  row: {
    cursor: 'pointer',
  },
  hover: {
    cursor: 'pointer',
  },
  dataCellLast: {
    borderTop: '1px solid #eeeeee',
  },
  parentGrid: {
    display: 'flex',
  },
  uploadButton: {
    marginLeft: '10px',
  },
  noDocuments: {
    padding: theme.spacing(1.5),
  },
  tableRow: {
    width: '100%',
  },
  icon: {
    marginRight: theme.spacing(1.5),
    verticalAlign: 'middle',
    transition: theme.transitions.create('transform'),
  },
});

export default styles;
