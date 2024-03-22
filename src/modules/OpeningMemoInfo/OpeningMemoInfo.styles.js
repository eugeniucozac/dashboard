const styles = (theme) => ({
  root: {
    margin: `${theme.spacing(5)}px 0 ${theme.spacing(10)}px`,
  },
  infoRoot: {
    marginBottom: theme.spacing(4),
  },
  infoContent: {
    '&&': {
      minWidth: 'auto',
    },
  },
  formRadio: {
    '& label': {
      flex: '0 50%',
    },
  },
  legend: {
    marginBottom: 0,
  },
  legendMargin: {
    '&&': {
      marginTop: theme.spacing(4),
      marginBottom: 0,
    },
  },
});

export default styles;
