const styles = (theme) => ({
  iconStyling: {
    color: 'white',
    backgroundColor: 'rgb(233, 61, 76)',
    borderRadius: theme.spacing(2),
  },
  daysLeft: {
    background: 'rgb(245, 245, 245)',
    fontSize: theme.typography.pxToRem(12),
    textAlign: 'center',
    padding: theme.typography.pxToRem(7),
    marginBottom: theme.spacing(2),
    border: '2px solid #bdbdbd',
  },
  stepper: {
    width: `calc(100% + ${theme.spacing(2)}px) !important`,
    marginTop: theme.spacing(1),
    marginLeft: theme.spacing(-1),
    marginRight: theme.spacing(-1),
  },
  stickyStepper: {
    position: 'sticky',
    top: theme.spacing(-1),
    background: 'white',
    zIndex: 9,
  },
});

export default styles;
