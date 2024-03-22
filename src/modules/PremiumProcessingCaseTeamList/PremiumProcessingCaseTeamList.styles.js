const styles = (theme) => ({
  info: {
    ...theme.mixins.summary.info,
  },
  boxes: {
    ...theme.mixins.summary.boxes,
    [theme.breakpoints.up('md')]: {
      width: '25%',
    },
    [theme.breakpoints.up('lg')]: {
      width: '20%',
    },
  },
  pass: {
    color: theme.palette.success.dark,
  },
  fail: {
    color: theme.palette.error.dark,
  },
});

export default styles;
