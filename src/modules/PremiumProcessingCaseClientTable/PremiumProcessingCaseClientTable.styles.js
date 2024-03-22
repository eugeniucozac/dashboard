const styles = (theme) => ({
  root: {
    '& > *': {
      borderBottom: 'unset',
    },
    style: {
      paddingBottom: 0,
      paddingTop: 0,
    },
  },
  disabled: {
    color: theme.palette.grey[400],
  },
  enabled: {
    color: theme.palette.success.light,
  },
});

export default styles;
