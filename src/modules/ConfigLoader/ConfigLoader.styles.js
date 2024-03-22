const styles = (theme) => ({
  grid: {
    height: '100vh',
    backgroundColor: theme.palette.grey[50],
  },
  logo: {
    display: 'inline-block',
    width: '100% !important',
    height: 70,
    maxWidth: '300px !important',
    marginBottom: theme.spacing(4),
  },
  paper: {
    textAlign: 'center',
    width: `calc(100% - ${theme.spacing(8)}px)`,
    maxWidth: theme.width.xs,
    padding: theme.spacing(4),
    margin: '0 auto',
  },
});

export default styles;
