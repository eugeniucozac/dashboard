const styles = (theme) => ({
  root: ({ offset }) => ({
    position: 'absolute',
    display: 'flex',
    justifyContent: 'flex-end',
    flexWrap: 'nowrap',
    bottom: `${offset}%`,
    left: 0,
    width: '100%',
    borderBottom: `2px dashed ${theme.palette.grey[200]}`,
    background: 'white',
    overflowY: 'hidden',
    transition: 'all 350ms ease',
    userSelect: 'none',
  }),
  label: ({ fullscreen }) => ({
    marginRight: '3vw',
    marginLeft: '6vw',
    fontSize: theme.typography.pxToRem(fullscreen ? 12 : 11),
    color: theme.palette.grey[400],
    whiteSpace: 'nowrap',
  }),
});

export default styles;
