const styles = (theme) => ({
  container: {
    overflowY: 'auto',
    paddingLeft: 32,
    paddingRight: 32,
  },
  title: {
    marginTop: theme.spacing(6),
    paddingBottom: theme.spacing(0.5),
    textTransform: 'uppercase',
    fontWeight: theme.typography.fontWeightBold,
    fontSize: theme.typography.pxToRem(14),
  },
  infoCardTitle: {
    marginBottom: theme.spacing(1),
    fontWeight: theme.typography.fontWeightMedium,
    color: theme.palette.neutral.darker,
  },
  infoCardValue: {
    fontWeight: theme.typography.fontWeightRegular,
    color: theme.palette.neutral.darker,
  },
});

export default styles;
