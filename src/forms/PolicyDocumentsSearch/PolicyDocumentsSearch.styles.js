const styles = (theme) => ({
  root: {
    ...theme.mixins.modal.dialog.root,
  },
  cell: ({ isMobile, isTablet }) => ({
    fontSize: theme.typography.pxToRem(isMobile || isTablet ? 11 : 12),
  }),
  linkWrapper: ({ isMobile, isTablet }) => ({
    display: 'inline-block',
    minWidth: isMobile ? 160 : isTablet ? 240 : 360,
  }),
  link: ({ isMobile, isTablet }) => ({
    fontSize: theme.typography.pxToRem(isMobile || isTablet ? 11 : 12),
    wordBreak: 'break-word',
  }),
});

export default styles;
