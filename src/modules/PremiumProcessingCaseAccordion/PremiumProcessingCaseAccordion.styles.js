const styles = (theme) => ({
  title: {
    fontSize: theme.typography.pxToRem(14),
    fontWeight: theme.typography.fontWeightMedium,
    paddingBottom: theme.spacing(1),
    textTransform: 'uppercase',
  },
  info: {
    ...theme.mixins.summary.info,
  },
  boxes: {
    ...theme.mixins.summary.boxes,
  },
  pass: {
    color: theme.palette.success.dark,
  },
  fail: {
    color: theme.palette.error.dark,
  },
  caseDueDateLabel: {
    backgroundColor: theme.palette.error.dark,
    padding: '4px 0px 4px 8px',
    borderRadius: '0px 15px 15px 0px',
    color: 'white',
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
