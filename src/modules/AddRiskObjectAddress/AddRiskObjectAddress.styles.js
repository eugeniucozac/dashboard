const styles = (theme) => ({
  details: {
    borderLeft: `1px solid ${theme.palette.grey[300]}`,
    borderRight: `1px solid ${theme.palette.grey[300]}`,
    backgroundColor: theme.palette.neutral.lightest,
    overflow: 'hidden',
  },
  table: {
    width: 'calc(100% + 1px)',
  },
  row: {
    height: 0,
    backgroundColor: 'transparent',
    borderColor: theme.palette.grey[300],
  },
  cell: {
    fontSize: theme.typography.pxToRem(10),
    color: theme.palette.neutral.dark,
    borderColor: theme.palette.grey[300],
    padding: 4,
  },
  error: {
    fontSize: `${theme.typography.pxToRem(12)} !important`,
  },
});

export default styles;
