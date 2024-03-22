const styles = (theme) => ({
  author: {
    fontWeight: theme.typography.fontWeightBold,
    fontSize: theme.typography.pxToRem(12),
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(0),
  },
  date: {
    fontSize: theme.typography.pxToRem(11),
    color: theme.palette.neutral.medium,
  },
  text: {
    fontSize: theme.typography.pxToRem(12),
  },
  textDescription: {
    fontSize: theme.typography.pxToRem(12),
    wordBreak: 'break-all',
    maxWidth: '80%'
  },
  typeYourResponseTextWidth: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  validQuery: {
    marginTop: theme.spacing(30),
  },
  label: {
    textTransform: 'none',
    textDecoration: 'underline',
    fontSize: theme.typography.pxToRem(11),
    '&:hover': {
      color: theme.palette.secondary.main,
    },
  },
});

export default styles;
