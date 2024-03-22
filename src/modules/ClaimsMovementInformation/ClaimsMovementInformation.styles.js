const styles = (theme) => ({
  cardHeader: {
    backgroundColor: theme.palette.grey[300],
    padding: theme.spacing(0.5, 2),
  },
  cardContent: {
    height: theme.typography.pxToRem(550),
    overflowY: 'auto',
  },
  cardLabel: {
    fontSize: theme.typography.pxToRem(12),
    fontWeight: theme.typography.fontWeightMedium,
  },
});

export default styles;
