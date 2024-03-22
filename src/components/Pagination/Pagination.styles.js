const styles = (theme) => ({
  root: {},
  rootCentered: {
    padding: `${theme.spacing(1)}px !important`,
  },
  toolbar: {},
  toolbarCentered: {
    justifyContent: 'center',
  },
  spacer: {},
  spacerCentered: {
    display: 'none',
  },
  actions: {},
  actionsCentered: {
    marginRight: -theme.spacing(2),
  },
  selectRoot: {},
  selectRootCentered: {
    [theme.breakpoints.down('xs')]: {
      marginLeft: theme.spacing(0.5),
      marginRight: theme.spacing(1.5),
    },
  },
});

export default styles;
