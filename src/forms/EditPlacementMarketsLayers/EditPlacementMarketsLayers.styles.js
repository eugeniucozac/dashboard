const styles = (theme) => ({
  root: {
    ...theme.mixins.modal.dialog.root,
    minHeight: 400,
  },
  container: {
    position: 'relative',
    width: '100%',
    display: 'flex',
    flexFlow: 'row',
    [theme.breakpoints.down('sm')]: {
      flexFlow: 'column',
    },
    maxWidth: 1240,
    transition: theme.transitions.create(['width', 'max-width']),
  },
  left: {
    position: 'relative',
    width: '50%',
    height: '100%',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      height: 'auto',
    },
    background: 'white',
    zIndex: 2,
    transition: theme.transitions.create(['width']),
  },
  right: {
    position: 'relative',
    width: '50%',
    height: '100%',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      height: 'auto',
      paddingLeft: '0!important',
      paddingTop: 20,
      marginTop: 20,
    },
    background: 'white',

    '&:before': {
      content: '""',
      position: 'absolute',
      top: -32,
      left: 0,
      width: 1,
      height: 'calc(100% + 64px)',
      background: theme.palette.neutral.light,
      [theme.breakpoints.up('sm')]: {
        bottom: -32,
      },
      [theme.breakpoints.down('sm')]: {
        right: -32,
        left: -32,
        top: 0,
        width: 'auto',
        height: '1px',
      },
    },
  },
  departmentRow: {
    marginBottom: 0,
  },
  status: {
    '&&': {
      minWidth: 120,
    },
  },
  section: {
    textTransform: 'uppercase',
  },
  notes: {
    fontSize: theme.typography.pxToRem(11),
    fontStyle: 'italic',
    color: theme.palette.neutral.main,
    paddingLeft: 5,
  },
  declinature: {
    marginTop: -16,
    transition: theme.transitions.create(['margin']),

    [theme.breakpoints.up('sm')]: {
      marginTop: -24,
    },

    [theme.breakpoints.up('md')]: {
      marginTop: -32,
    },
  },
  layerName: {
    position: 'relative',
    width: '100%',
  },
  marketStatus: {
    position: 'absolute',
    right: 0,
    top: 3,
  },
});
export default styles;
