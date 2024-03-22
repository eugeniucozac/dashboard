const styles = (theme) => ({
  root: ({ offset, margin, fullscreen }) => ({
    position: 'absolute',
    top: `${offset}%`,
    right: -margin.right,
    transform: 'translateY(-50%)',
    fontSize: theme.typography.pxToRem(fullscreen ? 12 : 11),
    color: theme.palette.neutral.main,
    transition: 'all 350ms ease',
    userSelect: 'none',
  }),
});

export default styles;
