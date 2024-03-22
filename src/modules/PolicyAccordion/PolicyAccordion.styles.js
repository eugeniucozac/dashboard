const styles = (theme) => ({
  root: {
    marginTop: theme.spacing(2.5),
    marginBottom: theme.spacing(2),
  },
  policies: {
    margin: '2px 0',
    fontSize: theme.typography.pxToRem(12),

    '&:first-child': {
      margin: '2px 0',
    },
  },
  chart: {
    margin: '0 auto',
  },
});

export default styles;
