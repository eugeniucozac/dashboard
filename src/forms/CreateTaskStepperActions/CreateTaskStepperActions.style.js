const styles = (theme) => ({
  root: {
    height: '100%',
  },
  footer: ({ isAllStepsCompleted }) => ({
    display: 'flex',
    justifyContent: 'flex-end',
    position: 'sticky',
    bottom: theme.typography.pxToRem(-16),
    right: 0,
    left: 0,
    backgroundColor: 'white',
    padding: theme.spacing(2, 0),
    textAlign: 'right',
    borderTop: '1px solid rgba(0, 0, 0, 0.12)',
  }),
  saveButton: {
    margin: theme.spacing(0, 0.5),
    backgroundColor: '#52b3cf',
  },
  backButton: {
    margin: theme.spacing(0, 0.5),
    backgroundColor: theme.palette.neutral.lightest,
    color: theme.palette.primary.main,
  },
  nextButton: {
    margin: theme.spacing(0, 0.5),
  },
});

export default styles;
