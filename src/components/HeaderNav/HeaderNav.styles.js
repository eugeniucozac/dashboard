const styles = (theme) => ({
  gridMenu: {
    flex: '0 1 auto',
  },
  gridLogo: {
    display: 'flex',
    flex: '1 1 auto',

    [theme.breakpoints.up('sm')]: {
      flex: '0 1 auto',
    },
  },
  gridMagnifier: {
    flex: '0 1 auto',
    paddingLeft: '4px !important',
    paddingRight: '4px !important',
  },
  gridNotifications: {
    flex: '0 1 auto',
    paddingLeft: '4px !important',
    paddingRight: '4px !important',
  },
  gridSearch: {
    flex: '1 1 auto',
    position: 'relative',
  },
  gridSearchDummy: {
    flex: 1,
  },
  gridSearchMobile: {},
  gridActions: {
    display: 'flex',
    flex: '0 1 auto',
  },
  listUser: {
    borderBottom: `1px solid ${theme.palette.divider}`,
    paddingTop: '0px',
    paddingBottom: '0px',
  },
  user: {
    padding: theme.spacing(2),
    paddingTop: 1,
    paddingBottom: 1,

    [theme.breakpoints.up('sm')]: {
      paddingTop: 10,
      paddingBottom: 0,
    },
  },
  info: {
    opacity: (props) => (props.isExpanded ? 1 : 0),
    transition: theme.transitions.create(['opacity']),
  },
  avatar: {
    marginRight: (props) => (props.isExpanded ? 12 : 4),
    transition: theme.transitions.create(['margin']),
  },
  hamburger: {
    marginLeft: -2,
    marginRight: -12,

    [theme.breakpoints.up('sm')]: {
      marginLeft: -10,
    },
  },
  logo: {
    maxWidth: 210,

    [theme.breakpoints.down('xs')]: {
      minHeight: theme.mixins.header.default.minHeight - 3, // minus 3px for border-top
    },

    [theme.breakpoints.up('sm')]: {
      '&&': {
        width: '30vw',
        maxWidth: 240,
      },
    },
  },
  magnifierIcon: {
    fontSize: '1.5rem',
  },
  notificationsBtn: {
    marginRight: -2,
  },
  notificationsIcon: {
    fontSize: '1.5rem',
  },
  toolbar: {
    display: 'flex',
    flex: '1 1 auto',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  floatingButton: {
    position: 'fixed',
    bottom: theme.spacing(2.5),
    right: theme.spacing(2.5),
  },
  search: () => ({
    '&&': {
      maxWidth: '100%',
      margin: 0,

      [theme.breakpoints.up('md')]: {
        width: `calc(100% - 4vw)`,
        marginLeft: '2vw',
        marginRight: '2vw',
      },

      [theme.breakpoints.up('lg')]: {
        width: `calc(100% - 12vw)`,
        marginLeft: '6vw',
        marginRight: '6vw',
      },

      [theme.breakpoints.up('xl')]: {
        width: `calc(100% - 24vw)`,
        marginLeft: '12vw',
        marginRight: '12vw',
      },
    },
  }),
  searchResults: () => ({
    position: 'absolute',
    marginTop: 4,
    width: '100%',

    [theme.breakpoints.up('sm')]: {
      width: 'calc(70vw - 100px)',
      maxWidth: 400,
      left: 12,
      right: 12,
    },

    [theme.breakpoints.up('md')]: {
      maxWidth: 750,
      left: 'calc(12px + 2vw)', // N px is for the grid spacing
      right: 'calc(12px + 2vw)', // N vw is for the search form margin
      width: 'calc(75vw - 120px)',
    },

    [theme.breakpoints.up('lg')]: {
      left: 'calc(12px + 6vw)',
      right: 'calc(12px + 6vw)',
    },

    [theme.breakpoints.up('xl')]: {
      left: 'calc(12px + 12vw)',
      right: 'calc(12px + 12vw)',
      maxWidth: 850,
    },
  }),
  searchMobileContainer: {
    width: '100%',
  },
  searchMobile: {
    position: 'relative',
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2),
  },
  logoutMenu: {
    paddingLeft: '20px',
  },
  popoverFrame: {
    maxHeight: 'calc(100% - 32px)',
    display: 'flex',
    flexDirection: 'column',
    width: 350,
    padding: theme.spacing(0),
    marginTop: '10px',
    borderTopRightRadius: 16,
    borderTopLeftRadius: 16,
  },
  popoverBoxTop: {
    borderTop: `12px solid ${theme.palette.primary.main}`,
  },
});

export default styles;
