const styles = (theme) => ({
  root: {
    ...theme.mixins.modal.dialog.root,
  },
  editCapacityType: {
    marginTop: `${theme.spacing(3)}px !important`,
  },
  capacityLegend: {
    marginTop: `${theme.spacing(6)}px !important`,
  },
  iconWritten: {
    fontSize: 18,
  },
});

export default styles;
