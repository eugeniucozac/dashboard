const styles = (theme) => ({
  title: {
    fontSize: theme.typography.pxToRem(14),
  },
  bgColorGrey: {
    backgroundColor: theme.palette.neutral.lighter,
  },
  stickyRightHeader: {
    position: 'sticky',
    right: 0,
    background: theme.palette.grey[100],
    zIndex: 9,
  },
  stickyLeftHeader: {
    position: 'sticky',
    left: 0,
    background: theme.palette.grey[100],
    zIndex: 9,
  },
  sortIcon: {
    margin: '-2px 4px',
  },
});

export default styles;
