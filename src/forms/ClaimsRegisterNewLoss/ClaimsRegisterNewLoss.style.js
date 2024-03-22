const styles = (theme) => ({
  iconContainer: {
    height: 24,
    fontSize: theme.typography.pxToRem(24),
    fontWeight: theme.typography.fontWeightBold,
  },
  iconContainerCompleted: {
    height: 24,
    fontSize: theme.typography.pxToRem(24),
    fontWeight: theme.typography.fontWeightBold,
    cursor: 'pointer',
  },
  linearProgress: {
    zIndex: 1,
    flex: '0 0 1px',
  },
  stepper: {
    padding: theme.spacing(3.25, 0, 3),
  },
});

export default styles;
