const styles = (theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100%',
    backgroundColor: 'white',
    background: 'rgb(200,210,218)',
    background: 'linear-gradient(0deg, rgba(255,255,255,1) 0%, rgba(221,229,237,1) 100%)', // eslint-disable-line no-dupe-keys
    backgroundSize: '100% 45%',
    backgroundPosition: 'top left',
    backgroundRepeat: 'repeat-x',

    [theme.breakpoints.up('sm')]: {
      paddingTop: theme.spacing(4),
    },
  },

  icon: {
    position: 'absolute',
    top: 0,
    left: '50%',
    maxWidth: 800,
    width: '80%',
    height: 'auto',
    marginTop: theme.spacing(-8),
    transform: 'translateX(-50%)',
    opacity: 0.06,
    zIndex: 0,
  },

  hero: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    padding: theme.spacing(3),

    [theme.breakpoints.up('sm')]: {
      padding: theme.spacing(5),
      paddingRight: 0,
    },
  },

  content: {
    flex: 1,
    marginTop: theme.spacing(3),
  },

  container: {
    paddingBottom: theme.spacing(8),
    padding: theme.spacing(3),
    paddingTop: 0,

    [theme.breakpoints.up('sm')]: {
      padding: theme.spacing(5),
    },
  },

  title: {
    fontSize: 26,
    fontSize: 'min(max(26px, 4.2vw), 40px)', // eslint-disable-line no-dupe-keys
    fontWeight: theme.typography.fontWeightMedium,
    textAlign: 'center',
    color: theme.palette.primary.main,
    marginBottom: theme.spacing(0.5),

    [theme.breakpoints.up('md')]: {
      fontSize: 'min(max(26px, 3.3vw), 40px)',
    },
  },

  subtitle: {
    fontSize: 12,
    fontSize: 'min(max(14px, 2vw), 18px)', // eslint-disable-line no-dupe-keys
    fontWeight: theme.typography.fontWeightRegular,
    textAlign: 'center',
    color: theme.palette.primary.light,

    [theme.breakpoints.up('md')]: {
      fontSize: 'min(max(12px, 1.6vw), 16px)',
    },
  },

  nobreak: {
    display: 'inline-block',
  },

  video: {
    position: 'relative',
    width: '90%',
    maxWidth: 640,
    margin: '0 auto',

    [theme.breakpoints.up('md')]: {
      width: '100%',
      maxWidth: 480,
      margin: '0 10% 0 auto',
    },

    '&:before, &:after': {
      position: 'absolute',
      content: '""',
      bottom: 15,
      left: 10,
      width: '50%',
      top: '80%',
      maxWidth: 300,
      background: '#777',
      boxShadow: '0 15px 10px #777',
      transform: 'rotate(-3deg)',
      zIndex: 0,
    },

    '&:after': {
      transform: 'rotate(3deg)',
      right: 10,
      left: 'auto',
    },
  },

  responsive: {
    padding: '56.25% 0 0 0',
    position: 'relative',
    zIndex: 1,
    backgroundColor: 'white',
    border: `2px solid ${theme.palette.primary.dark}`,
    borderRadius: 4,
    boxSizing: 'content-box',
  },

  iframe: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },

  panel: {
    background: `transparent`,
    marginBottom: 0,
  },

  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    borderBottom: `1px solid ${theme.palette.primary.main}`,
    paddingBottom: 2,
  },

  sectionIcon: {
    marginRight: theme.spacing(1),
  },

  sectionTitle: {
    fontWeight: theme.typography.fontWeightRegular,
    marginBottom: 0,
  },
});

export default styles;
