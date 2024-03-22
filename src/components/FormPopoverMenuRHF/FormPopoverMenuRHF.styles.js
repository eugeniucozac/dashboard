const styles = (theme) => ({
  root: {
    display: 'block',
  },
  btnOffset: {
    marginTop: -4,
    marginLeft: -6,
  },
  btn: {
    padding: '0 6px',
    maxWidth: '100%',
    minHeight: 24,
    textAlign: 'left',
  },
  label: {
    maxWidth: '100%',
    textTransform: 'none',
    fontSize: theme.typography.pxToRem(12),
    fontWeight: theme.typography.fontWeightRegular,

    '& > span': {
      ...theme.mixins.ellipsis,
    },
  },
});

export default styles;
