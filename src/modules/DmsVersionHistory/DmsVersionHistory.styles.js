const styles = (theme) => ({
  root: {
    padding: theme.spacing(3.5, 4, 4),
  },
  date: {
    fontSize: theme.typography.pxToRem(11),
    color: theme.palette.neutral.main,
  },
  icon: {
    flex: '0 1 auto',
    marginLeft: theme.spacing(1.5),
    fontSize: theme.typography.pxToRem(24),
    color: theme.palette.neutral.dark,
    cursor: 'pointer',

    '& > svg': {
      display: 'block',
    },
  },
});

export default styles;
