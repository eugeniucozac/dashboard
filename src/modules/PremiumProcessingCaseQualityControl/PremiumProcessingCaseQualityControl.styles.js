const styles = (theme) => ({
  title: {
    marginTop: `${theme.spacing(6)}px !important`,
    paddingBottom: `1px`,
    textTransform: 'uppercase',
    fontWeight: theme.typography.fontWeightBold,
    fontSize: theme.typography.pxToRem(14),
  },

  description: {
    width: '30%',
    marginBottom: 20,
  },
  passColor: {
    color: theme.palette.success.dark,
  },
  failColor: {
    color: theme.palette.error.dark,
  },
  details: {
    display: 'flex',
    flexWrap: 'wrap',
    paddingTop: theme.spacing(2),
    width: '50%',
  },
  apiFetchErrorIcon: {
    color: theme.palette.error.light,
  },
});

export default styles;
