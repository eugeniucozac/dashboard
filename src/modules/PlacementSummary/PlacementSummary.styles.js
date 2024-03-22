const styles = (theme) => ({
  info: {
    ...theme.mixins.summary.info,
  },
  boxes: {
    ...theme.mixins.summary.boxes,
  },
  boxesEmpty: {
    ...theme.mixins.summary.boxesEmpty,
  },
  clients: {
    display: 'block',
    marginTop: 2,
    marginBottom: 6,
    lineHeight: 1.1,

    '&:last-child': {
      marginBottom: 0,
    },
  },
});

export default styles;
