const styles = (theme) => ({
  breadcrumb: {
    ...theme.mixins.overflowPanel,
  },
  placementContainer: {
    maxWidth: 1400,
    width: '100%',
    marginLeft: 'auto',
    marginRight: 'auto',
    border: `1px solid ${theme.palette.neutral.light}`,
    borderTop: 0,
  },
  breadcrumbBox: {
    width: '100%',
  },
  placementContent: {
    padding: theme.spacing(3),
  },
});

export default styles;
