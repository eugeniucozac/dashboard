const styles = (theme) => ({
  footer: {
    padding: theme.spacing(2),
    paddingTop: theme.spacing(4),
    textAlign: 'center',

    [theme.breakpoints.down('xs')]: {
      paddingTop: theme.spacing(2),
      borderTop: `1px solid ${theme.palette.neutral.light}`,
      backgroundColor: theme.palette.grey[50],
    },
  },
  version: {
    textAlign: 'center',
    fontStyle: 'italic',
    fontSize: theme.typography.pxToRem(11),
    color: theme.palette.neutral.medium,
  },
});

export default styles;
