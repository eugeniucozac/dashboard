const styles = (theme) => ({
  root: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'flex',
    },
    width: '100%',
    maxWidth: 260,
    flexDirection: 'row',
    alignItems: 'center',
  },
  form: {
    marginTop: 0,
  },
});

export default styles;
