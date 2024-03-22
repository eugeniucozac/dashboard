const styles = (theme) => ({
  root: {
    height: '100%',
  },
  footer: ({ isAllStepsCompleted }) => ({
    display: 'flex',
    justifyContent: `${!isAllStepsCompleted ? 'space-between' : 'flex-end'}`,
    position: 'sticky',
    bottom: 0,
    right: 0,
    left: 0,
    backgroundColor: theme.palette.grey[100],
    padding: theme.spacing(1, 2),
    textAlign: 'right',
  }),
  button: {
    margin: '0 5px',
  },
});

export default styles;
