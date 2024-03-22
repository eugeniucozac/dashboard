const styles = (theme) => ({
  title: {
    fontSize: theme.typography.pxToRem(14),
    fontWeight: theme.typography.fontWeightBold,
    textTransform: 'uppercase',
    color: theme.palette.neutral.darker,
    lineHeight: 1,

    '& ~ p': {
      marginLeft: theme.spacing(1),
    },
  },
  subtitle: {
    fontSize: theme.typography.pxToRem(11),
    fontWeight: theme.typography.fontWeightRegular,
    color: theme.palette.neutral.medium,
    lineHeight: 1,
  },
  divider: {
    marginTop: theme.spacing(0.25),
  },
});

export default styles;
