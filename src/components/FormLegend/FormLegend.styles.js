const styles = (theme) => ({
  legend: {
    marginTop: theme.spacing(6),
    marginBottom: theme.spacing(4),
    paddingBottom: theme.spacing(0.5),
    borderBottom: `1px dotted ${theme.palette.neutral.light}`,
    textTransform: 'uppercase',
    fontWeight: theme.typography.fontWeightBold,
    fontSize: theme.typography.pxToRem(14),
  },
});

export default styles;
