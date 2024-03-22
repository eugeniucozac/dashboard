const styles = (theme) => ({
  author: {
    fontWeight: theme.typography.fontWeightBold,
    fontSize: theme.typography.pxToRem(12),
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(0),
  },
  date: {
    fontSize: theme.typography.pxToRem(11),
    color: theme.palette.neutral.main,
  },
  text: {
    fontSize: theme.typography.pxToRem(12),
  },
  textDescription: {
    fontSize: theme.typography.pxToRem(12),
    wordBreak: 'break-all',
    maxWidth: '80%'
  },
  resolution: {
    marginTop: theme.spacing(0.25),
    fontSize: theme.typography.pxToRem(12),
    color: theme.palette.secondary.main,

    '& > strong': {
      fontWeight: theme.typography.fontWeightBold,
    },
  },
  loopDivider: {
    height: 0,
    backgroundColor: 'transparent',
    borderTop: `1px dashed ${theme.palette.neutral.lighter}`,
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
