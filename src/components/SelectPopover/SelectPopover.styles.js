const styles = (theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    width: 'auto',
    height: 'auto',
    overflow: 'hidden',
  },
  popoverFrame: {
    maxHeight: 'calc(100% - 32px)',
    display: 'flex',
    flexDirection: 'column',
    width: 240,
    padding: theme.spacing(2),
  },
  selectButton: {
    padding: '0 6px',
    maxWidth: '100%',
    minHeight: 24,
    textAlign: 'left',
    textTransform: 'none',
    fontSize: theme.typography.pxToRem(12),
    fontWeight: theme.typography.fontWeightRegular,
  },
  error: { color: theme.palette.error.main },
});

export default styles;
