const styles = (theme) => ({
  labelWithComponent: {
    marginTop: theme.spacing(1),
    marginBottom: 0,
  },
  labelIndent: {
    paddingLeft: theme.spacing(0.6),
  },
  labelIndentExtra: {
    paddingLeft: theme.spacing(6),
  },
  cell: {
    paddingLeft: `${theme.spacing(0.5)}px !important`,
    paddingRight: `${theme.spacing(0.5)}px !important`,
  },
  subCell: {
    background: theme.palette.grey[50],
  },
  subCellHeader: {
    background: theme.palette.grey[100],
  },
  errorLabel: {
    color: theme.palette.error.dark,
  },
});

export default styles;
