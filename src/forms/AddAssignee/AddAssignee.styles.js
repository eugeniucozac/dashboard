const styles = (theme) => ({
  root: {
    ...theme.mixins.modal.dialog.root,
  },
  formcontainer: {
    margin: theme.spacing(1.5),
    padding: theme.spacing(0, 0.5),
  },
  requiredLabelGrid: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(3),
  },
  requiredLabel: {
    fontSize: theme.typography.pxToRem(12),
    float: 'right',
  },
  formGridcontainer: {
    marginBottom: theme.spacing(2),
    paddingRight: theme.spacing(2.5),
  },
  formLabel: {
    padding: theme.spacing(1.5, 1),
  },
});

export default styles;
