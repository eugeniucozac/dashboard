const styles = (theme) => ({
  root: ({ size, bold }) => ({
    ...(size === 'xs' && { fontSize: theme.typography.pxToRem(10) }),
    ...(size === 'sm' && { fontSize: theme.typography.pxToRem(11) }),
    ...(size === 'md' && { fontSize: theme.typography.pxToRem(12) }),
    ...(size === 'lg' && { fontSize: theme.typography.pxToRem(14) }),
    ...(size === 'xl' && { fontSize: theme.typography.pxToRem(16) }),
    ...(bold && { fontWeight: theme.typography.fontWeightMedium }),
  }),
});

export default styles;
