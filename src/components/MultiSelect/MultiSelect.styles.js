const styles = (theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
  form: {
    flex: '0 0 auto',
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1.25),
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
  clearBtn: {
    padding: '8px !important',
  },
  adornmentStart: {
    marginTop: 1,
    fontSize: 21,
  },
  adornmentEnd: {
    marginRight: -theme.spacing(1),
  },
  list: {
    overflow: 'auto',
  },
  listItem: {
    paddingBottom: 3,
    paddingLeft: 12,
  },
  listItemIcon: {
    minWidth: 30,
    marginLeft: -8,

    '& > span': {
      padding: 0,
    },
  },
});

export default styles;
