const styles = (theme) => ({
  root: {
    ...theme.mixins.modal.dialog.root,
  },
  promptText: {
    margin: theme.spacing(5),
    paddingTop: theme.spacing(5),
  },
  // title: {
  //     padding: theme.spacing(0.5, 0),
  //     textTransform: 'uppercase',
  //     fontWeight: theme.typography.fontWeightBold,
  //     fontSize: theme.typography.pxToRem(14),
  // },
});

export default styles;
