const styles = (theme) => ({
  report: {
    overflow: 'hidden',
    paddingTop: '59%',
    position: 'relative',
    marginBottom: theme.spacing(2),
    '& iframe': {
      border: 0,
      height: '100%',
      left: 0,
      position: 'absolute',
      top: 0,
      width: '100%',
    },
  },
});

export default styles;
