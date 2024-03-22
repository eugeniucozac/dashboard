const styles = (theme) => ({
  root: {
    ...theme.mixins.modal.dialog.root,
  },
  list: {
    fontSize: theme.typography.pxToRem(11),
    color: theme.palette.neutral.main,
  },
  listTitle: {
    fontWeight: theme.typography.fontWeightMedium,
    fontSize: theme.typography.pxToRem(11),
    color: theme.palette.neutral.dark,
    marginLeft: theme.spacing(0.25),
    marginRight: theme.spacing(0.5),
  },
  logo: {
    display: 'block',
    width: 'auto',
    height: 'auto',
    maxWidth: '100%',
    maxHeight: 14,
    marginRight: 12,
  },
  insuredProvisional: {
    color: 'red',
  },
});

export default styles;
