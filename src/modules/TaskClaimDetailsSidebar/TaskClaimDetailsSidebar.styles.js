const styles = (theme) => ({
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
  },
  info: {
    ...theme.mixins.summary.info,
  },
  boxes: {
    ...theme.mixins.summary.boxes,
  },
});

export default styles;
