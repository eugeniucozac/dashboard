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
    marginRight: -theme.spacing(1),
  },
  adornmentStart: {
    marginTop: 1,
    fontSize: 21,
  },
  list: ({ fetching }) => ({
    overflow: 'auto',
    opacity: fetching ? 0.3 : 1,
  }),
  listMargin: {
    marginBottom: theme.spacing(2),
  },
  listItem: {
    paddingBottom: 3,
    paddingLeft: 12,
  },
  listItemIcon: {
    minWidth: 30,
    marginLeft: theme.spacing(-1),

    '& > span': {
      padding: 0,
    },
  },
  selectedMax: ({ fetching }) => ({
    fontSize: theme.typography.pxToRem(12),
    fontWeight: theme.typography.fontWeightMedium,
    marginTop: theme.spacing(-1),
    marginBottom: theme.spacing(-0.5),
    opacity: fetching ? 0.3 : 1,
  }),
  hint: {
    color: theme.palette.neutral.main,
    fontSize: theme.typography.pxToRem(12),
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  selected: {
    flex: '1 0 auto',
  },
});

export default styles;
