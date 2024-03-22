const styles = (theme) => ({
  root: {
    marginTop: `${theme.spacing(2)}px !important`,
    marginBottom: theme.spacing(-1),
    color: theme.palette.info.dark,
    fontSize: theme.typography.pxToRem(12),
  },
  dialog: {
    padding: theme.spacing(0, 4),
  },
});

export default styles;
