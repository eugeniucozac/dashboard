const styles = (theme) => ({
  root: {
    position: 'relative',
    width: '100%',
    height: '0',
    transition: 'all 350ms ease',
    zIndex: 1,
  },
  container: ({ margin }) => ({
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    paddingTop: margin.top,
    paddingRight: margin.right,
    paddingBottom: margin.bottom,
    paddingLeft: margin.left,
  }),
  mudmap: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },
});

export default styles;
