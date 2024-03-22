const styles = (theme) => ({
  root: {
    position: 'sticky',
    borderBottom: '1px solid white',
    backgroundColor: 'white',
    transition: theme.transitions.create(['padding', 'margin', 'width', 'border', 'box-shadow']),
  },
  shadow: {
    boxShadow: theme.shadows[1],
  },
  border: {
    position: 'absolute',
    top: '100%',
    left: 0,
    width: '100%',
    height: 1,
    backgroundColor: 'transparent',
    transition: theme.transitions.create(['background-color']),
  },
  borderVisible: {
    backgroundColor: theme.palette.neutral.light,
  },
  observer: {
    position: 'absolute',
    width: 1,
    top: -2,
    height: 1,
  },
});

export default styles;
