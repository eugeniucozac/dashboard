const styles = (theme) => ({
  root: {
    paddingTop: 30,
  },

  info: {
    marginBottom: 20,
  },

  detailContainer: {
    marginLeft: 40,
  },

  detail: {
    marginBottom: 15,
  },

  introductionLabel: {
    fontWeight: theme.typography.fontWeightMedium,
    marginBottom: 10,
  },

  label: {
    fontWeight: theme.typography.fontWeightMedium,
  },

  introduction: {
    padding: `${30}px 0 ${10}px`,
    width: '100%',
    marginTop: 40,
    borderTop: `1px solid ${theme.palette.neutral.light}`,
    fontSize: theme.typography.pxToRem(11),
    lineHeight: 2,
  },
});

export default styles;
