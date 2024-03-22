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
    fontWeight: theme.typography.fontWeightMedium,
    fontSize: theme.typography.pxToRem(14),
    borderBottom: `2px dotted ${theme.palette.neutral.light}`,
    textTransform: 'uppercase',
  },
  fileTitle: {
    textAlign: 'left',
    fontSize: theme.typography.pxToRem(14),
    fontWeight: theme.typography.fontWeightMedium,
    color: theme.palette.neutral.darker,
  },
  editIcon: {
    cursor: "pointer"
  }
});

export default styles;
