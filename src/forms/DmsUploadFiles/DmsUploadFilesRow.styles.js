const styles = (theme) => ({
  root: {
    '& > *': {
      borderBottom: 'unset',
    },
  },
  cellWidth: {
    width: '25%',
    paddingLeft: 0,
    '&:last-child': {
      width: '5%',
    },
  },
  iconSuccess: {
    color: theme.palette.success.dark,
  },
  btnRetry: {
    textTransform: 'capitalize',
    textDecoration: 'underline',
    fontSize: theme.typography.pxToRem(12),
  },
});

export default styles;
