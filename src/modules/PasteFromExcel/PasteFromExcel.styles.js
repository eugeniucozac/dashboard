const styles = (theme) => ({
  root: {
    ...theme.mixins.modal.dialog.root,
    overflowY: 'auto',
    flexDirection: 'column',
    padding: theme.spacing(2),
    backgroundColor: theme.palette.grey[50],
  },
  tableContainer: {
    maxHeight: theme.spacing(40),
  },
  textarea: {
    '& textarea': {
      fontSize: theme.typography.pxToRem(12),
    },
  },
  hint: {
    fontSize: theme.typography.pxToRem(13),
    color: theme.palette.neutral.main,
  },
  button: {
    alignSelf: 'flex-end',
  },
  table: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  cell: {
    fontSize: theme.typography.pxToRem(10),
    padding: '4px 8px 4px 0',
  },
});

export default styles;
