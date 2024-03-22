const styles = (theme) => ({
  container: {
    overflowY: 'auto',
    paddingLeft: 32,
    paddingRight: 32,
  },
  detailsCardTitle: {
    fontSize: `${theme.typography.pxToRem(13)} !important`,
    marginBottom: theme.spacing(2),
  },
  detailsCardText: {
    fontSize: `${theme.typography.pxToRem(12)} !important`,
  },
});

export default styles;
