const styles = (theme) => ({
  container: {
    overflowY: 'auto',
    paddingLeft: 32,
    paddingRight: 32,
  },
  spacingContainer: {
    margin: theme.spacing(3, 0, 5, 0),
  },
  detailsCardTitle: {
    fontSize: `${theme.typography.pxToRem(13)} !important`,
  },
  detailsCardText: {
    fontSize: `${theme.typography.pxToRem(12)} !important`,
  },
  confirmTitles: {
    marginTop: theme.spacing(6),
    textTransform: 'uppercase',
    fontWeight: theme.typography.fontWeightBold,
    fontSize: theme.typography.pxToRem(14),
  },
  gutterBottom: {
    borderBottom: `1px dotted ${theme.palette.neutral.light}`,
  },
  fileTitle: {
    textAlign: 'left',
    fontSize: theme.typography.pxToRem(14),
    fontWeight: theme.typography.fontWeightMedium,
    color: theme.palette.neutral.darker,
  },
});

export default styles;
