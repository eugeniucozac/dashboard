const styles = (theme) => ({
  container: {
    overflowY: 'auto',
    paddingLeft: 32,
    paddingRight: 32,
  },
  icon: {
    display: 'flex',
    marginRight: 4,
  },
  title: {
    fontSize: theme.typography.pxToRem(13),
    fontWeight: theme.typography.fontWeightMedium,
  },
});

export default styles;
