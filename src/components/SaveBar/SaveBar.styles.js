const styles = (theme) => ({
  root: {
    zIndex: 1100,
    backgroundColor: 'white',
    position: 'sticky',
    bottom: 0,
    padding: theme.spacing(4, 5),
    borderTop: `1px solid ${theme.palette.neutral.light}`,
    borderBottom: `1px solid ${theme.palette.neutral.light}`,
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(-3),
    marginRight: theme.spacing(-3),
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(-5),
      marginRight: theme.spacing(-5),
    },
    '& > *': {
      justifyContent: 'center',
      [theme.breakpoints.up('sm')]: {
        justifyContent: 'flex-end',
      },
    },
  },
});

export default styles;
