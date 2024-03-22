const styles = (theme) => ({
  paper: {
    maxWidth: 'none',
  },
  title: {
    marginBottom: 0,
  },
  subtitle: {
    marginBottom: 0,
  },
  close: {
    position: 'absolute',
    top: 11,
    right: 11,
  },
  fullScreen: {
    position: 'absolute',
    top: 11,
    right: 40,
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  hint: {
    padding: theme.spacing(3, 4),
    marginBottom: 0,
  },
});

export default styles;
