const styles = (theme) => ({
  root: {
    position: 'absolute',
    right: 10,
    top: 10,
    width: 200,
    zIndex: 1,
    padding: 10,
    backgroundColor: 'white',
    boxShadow: theme.shadows[1],
    borderRadius: 4,
  },
  label: {
    fontSize: theme.typography.pxToRem(11),
  },
  select: {
    marginBottom: 5,
  },
  link: {
    alignItems: 'end',
  },
  disabled: {
    color: theme.palette.disabled.color,
  },
});

export default styles;
