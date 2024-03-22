const styles = (theme) => ({
  root: {
    display: 'flex',
    alignItems: 'flex-start',
    width: '100%',

    [theme.breakpoints.up('sm')]: {
      maxWidth: 240,
      marginRight: 0,
      marginLeft: 'auto',
    },
  },
  form: {
    flex: 1,
  },
  input: {
    flex: 1,
    margin: 0,
    padding: 0,

    '& > .MuiInputBase-root': {
      backgroundColor: 'white',
    },

    '& > div > input': {
      paddingTop: 9.5,
      paddingBottom: 7.5,
      textOverflow: 'ellipsis',
    },
  },
  btn: {
    flex: 0,
    marginLeft: theme.spacing(0.5),
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
  inputBtn: {
    padding: '6px !important',
  },
  adornmentStart: {
    marginTop: 1,
    fontSize: 21,
  },
  adornmentEnd: {
    marginRight: -theme.spacing(1),
  },
});

export default styles;
