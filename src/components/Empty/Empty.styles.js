const styles = (theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    width: '100%',
    maxWidth: (props) => Math.max(props.width || 400, 200),
    padding: (props) => (props.padding ? theme.spacing(3) : 0),
    margin: '20px auto 0',

    [theme.breakpoints.up('sm')]: {
      padding: (props) => (props.padding ? theme.spacing(5) : 0),
    },

    [theme.breakpoints.up('md')]: {
      marginTop: 0,
    },
  },
  iconContainer: {
    position: 'relative',
    width: '80%',
    overflow: 'hidden',
    margin: (props) => (props.bg ? 0 : '-15% 0'),
    backgroundColor: (props) => (props.bg ? theme.palette.neutral.lightest : 'transparent'),
    borderRadius: (props) => (props.bg ? '50%' : 0),

    '&:after': {
      content: '""',
      display: 'block',
      paddingBottom: '100%',
    },
  },
  icon: {
    position: 'absolute',
    width: '70%',
    height: '70%',
    margin: '15%',
    color: theme.palette.grey[700],
  },
  title: {
    marginTop: theme.spacing(4),
  },
  text: {
    textAlign: 'center',
    color: theme.palette.neutral.main,
  },
  errorText: {
    textAlign: 'center',
    color: theme.palette.error.main,
    fontSize: theme.typography.pxToRem(12),
  },
  link: {
    marginTop: theme.spacing(2),
    color: theme.palette.secondary.main,
    cursor: 'pointer',
  },
  button: {
    marginTop: theme.spacing(2),
  },
});

export default styles;
