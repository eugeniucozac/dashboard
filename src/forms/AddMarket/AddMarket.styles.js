const styles = (theme) => ({
  root: {
    ...theme.mixins.modal.dialog.root,
  },
  addQuote: {
    marginTop: `${theme.spacing(3)}px !important`,
  },
  quoteLegend: {
    marginTop: `${theme.spacing(6)}px !important`,
  },
  dateFields: {
    marginTop: '2px !important',
  },
  iconWritten: {
    fontSize: 18,
  },
});

export default styles;
