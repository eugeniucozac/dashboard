const styles = (theme) => ({
  form: {
    marginTop: theme.spacing(1),
  },
  ugSelectLabel: {
    padding: theme.spacing(1.5, 0.5),
    '& p': {
      textAlign: 'right',
    },
  },
  ugSelectField: {
    margin: `0 ${theme.spacing(0.9)}px`,
    maxWidth: '80%',

    '& .MuiOutlinedInput-input': {
      width: '286px',
    },
  },
});

export default styles;
