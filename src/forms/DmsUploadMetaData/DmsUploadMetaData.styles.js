const styles = (theme) => ({
  subTitle: {
    fontWeight: theme.typography.fontWeightBold,
    fontSize: theme.typography.pxToRem(14),
    paddingBottom: theme.spacing(1),
    paddingTop: theme.spacing(1),
  },
  boxView: {
    padding: theme.spacing(1.5),
    border: `1px solid ${theme.palette.grey[200]}`,
  },
});

export default styles;
