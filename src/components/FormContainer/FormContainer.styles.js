const styles = (theme) => ({
  default: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    marginTop: theme.spacing(3),
  },
  dialog: {
    overflow: 'hidden',
    marginTop: 0,
  },
  blank: {
    display: 'block',
    flex: 'none',
    flexDirection: 'row',
    marginTop: 0,
  },
});

export default styles;
