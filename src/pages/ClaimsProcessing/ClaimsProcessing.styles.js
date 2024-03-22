const styles = (theme) => ({
  stepperRoot: {
    width: `calc(100% + ${theme.spacing(4)}px) !important`,
    marginLeft: theme.spacing(-2),
    marginRight: theme.spacing(-2),
  },
  stepper: {
    padding: 0,
    marginTop: theme.spacing(-1),
  },
});

export default styles;
