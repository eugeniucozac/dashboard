const styles = (theme) => ({
  wrapper: {
    margin: theme.spacing(0, 5, 5, 5),
    paddingTop: theme.spacing(1),
    borderTop: `1px solid ${theme.palette.neutral.light}`,
  },
  search: {
    maxWidth: '100%!important',
    marginBottom: theme.spacing(1),
  },
  tableWrapper: {
    marginLeft: 0,
  },
  searchWrapper: {
    marginTop: theme.spacing(1.5),
  },
  title: {
    padding: theme.spacing(0.5, 0),
    textTransform: 'uppercase',
    fontWeight: theme.typography.fontWeightBold,
    fontSize: theme.typography.pxToRem(14),
  },
});

export default styles;
