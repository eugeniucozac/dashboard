const styles = (theme) => ({
  paper: {
    maxWidth: 'none',
  },
  title: {
    marginBottom: 0,
  },
  titleChildren: {
    paddingLeft: 0,
    backgroundColor: theme.palette.primary.contrastText,
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
    overflow: 'auto',
  },
  text: {
    color: theme.palette.neutral.dark,
    padding: theme.spacing(3, 4),
    marginBottom: 0,
  },
  hint: {
    color: theme.palette.neutral.darker,
    padding: theme.spacing(3, 4),
    marginBottom: 0,
    fontSize: theme.typography.pxToRem(12),
  },
});

export default styles;
