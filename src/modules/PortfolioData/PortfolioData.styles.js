const styles = (theme) => ({
  root: {
    borderBottom: `solid 1px ${theme.palette.grey[300]}`,
    display: 'flex',
    fontSize: theme.typography.pxToRem(12),
  },
  endMessage: {
    fontSize: theme.typography.pxToRem(12),
    textAlign: 'center',
    padding: theme.spacing(1),
  },
  missingLocation: {
    display: 'flex',
    color: theme.palette.error.main,
  },
  errorIcon: {
    fontSize: theme.typography.pxToRem(14),
    height: theme.spacing(2),
    width: theme.spacing(2),
    marginRight: theme.spacing(0.5),
  },
  tiv: {
    padding: `${theme.spacing(1)}px ${theme.spacing(1)}px 0`,
  },
  address: {
    padding: `${theme.spacing(1)}px ${theme.spacing(1)}px 0`,
    maxWidth: 200,
    width: '100%',
  },
  accounts: {
    flex: 1,
  },
});

export default styles;
