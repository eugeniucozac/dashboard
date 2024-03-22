const styles = (theme) => ({
  root: ({ offset, margin, bold, fullscreen }) => ({
    position: 'absolute',
    color: theme.palette.grey[bold ? 700 : 500],
    fontWeight: theme.typography[bold ? 'fontWeightMedium' : 'fontWeightRegular'],
    fontSize: theme.typography.pxToRem(fullscreen ? 12 : 11),
    transition: 'all 350ms ease',
    userSelect: 'none',

    '& > span': {
      position: 'absolute',
      bottom: 0,
    },
  }),
  xAxis: ({ offset, margin, bold }) => ({
    top: -margin.top,
    bottom: -margin.bottom,
    left: `${offset}%`,
    height: `calc(100% + ${margin.top}px + ${margin.bottom}px)`,
    textIndent: 1,
    borderLeft: `1px dashed ${theme.palette.grey[bold ? 500 : 300]}`,
  }),
  yAxis: ({ offset, margin, bold }) => ({
    bottom: `${offset}%`,
    left: -margin.left,
    right: -margin.right,
    width: `calc(100% + ${margin.left}px + ${margin.right}px)`,
    borderTop: `1px dashed ${theme.palette.grey[bold ? 500 : 300]}`,
  }),
});

export default styles;
