const styles = (theme) => ({
  pageContainer: {
    maxWidth: 1400,
    width: '100%',
    marginLeft: 'auto',
    marginRight: 'auto',
    border: `1px solid ${theme.palette.neutral.light}`,
    borderTop: 0,
  },
  root: {
    borderBottom: `1px solid ${theme.palette.neutral.light}`,
    width: '100%',
    zIndex: 100,
    position: 'relative',
    backgroundColor: 'white',
    padding: `5px 0`,
    display: 'flex',
    flexDirection: 'column',
    flex: '1 1 100%',
    justifyContent: 'flex-start',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'nowrap',
    margin: 0,
    transition: theme.transitions.create('margin'),
    zIndex: 100,
    backgroundColor: 'white',
  },

  headerContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'start',
    flex: '1 0 auto',
    minWidth: 0,
    marginRight: theme.spacing(1),
  },

  headerTitle: {
    margin: 0,
    marginLeft: theme.spacing(3),
    marginRight: theme.spacing(3),
    fontSize: theme.typography.pxToRem(18),
    fontWeight: theme.typography.fontWeightRegular,
    transition: theme.transitions.create('margin'),
    maxWidth: 600,
    ...theme.mixins.ellipsis,
  },
  title: {
    flex: '1 1 auto',
    display: 'flex',
    marginBottom: theme.spacing(1),
    fontSize: theme.typography.pxToRem(14),
    transition: theme.transitions.create('margin'),
    ...theme.mixins.breakword,
    [theme.breakpoints.up('sm')]: {
      fontSize: theme.typography.pxToRem(18),
    },
  },
  info: {
    margin: theme.spacing(3),

    flex: '1 1 auto',
    display: 'flex',
    maxWidth: '100%',
  },
  boxes: {
    ...theme.mixins.summary.boxes,
  },
  paper: {
    zIndex: 99,
    position: 'relative',
    padding: theme.spacing(3),
    flex: '1 1 100%',
    borderRadius: '0 0 3px 3px',
    marginTop: -2,
    '&:before': {
      content: ' ',
      position: 'absolute',
      left: 0,
      top: -2,
      width: '100%',
      height: 10,
      backgroundColor: 'red',
    },
  },
  quotesContainer: {
    borderTop: `1px solid ${theme.palette.neutral.light}`,
    borderBottom: `1px solid ${theme.palette.neutral.light}`,
    width: '100%',
    padding: `20px ${theme.spacing(3)}px`,
  },
});

export default styles;
