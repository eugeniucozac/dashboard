const styles = (theme) => ({
  root: {
    width: '100%',
    position: 'relative',
    height: '100%',
  },
  overflow: {
    width: `calc(100% + ${theme.spacing(6)}px)`,
    margin: theme.spacing(0, -3),

    [theme.breakpoints.up('sm')]: {
      width: `calc(100% + ${theme.spacing(10)}px)`,
      margin: theme.spacing(0, -5),
    },
  },
  placementOverflow: {
    width: `calc(100% + ${theme.spacing(6)}px)`,
    margin: theme.spacing(0, -3),

    [theme.breakpoints.up('sm')]: {
      width: `calc(100% + ${theme.spacing(6)}px)`,
      margin: theme.spacing(0, -3),
    },
  },
  fullScreen: {
    position: 'fixed',
    top: '0px',
    left: '0px',
    bottom: '0px',
    right: '0px',
    zIndex: theme.zIndex.modal - 1,

    '& > .map': {
      height: '100%',
      border: 0,
    },
  },
  responsive: {
    width: '100%',
    height: '100%',

    '& > .map': {
      width: '100% !important',
      height: '100% !important',
    },
  },
  map: {
    position: 'relative',
    width: '100%',
    border: `1px solid ${theme.palette.grey[400]}`,
    background: 'linear-gradient(#75cff0, #75cff0, #f4f0ea, #f4f0ea)', // hack to display the ocean blue at the top and antarctica white at the bottom

    '& > .mapboxgl-canvas-container': {
      filter: 'blur(0)',
      transition: theme.transitions.create(['filter'], {
        duration: '1s',
      }),
    },

    '& .mapboxgl-canvas': {
      '&:focus': {
        outline: 'none',
      },
    },
  },
  mapOverflow: {
    borderLeft: 0,
    borderRight: 0,
  },
  mapOverlay: {
    '& > .mapboxgl-canvas-container': {
      filter: 'blur(2px)',
    },
  },
  overlay: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    width: '100%',
    height: '100%',
    padding: '20px 60px',
    textAlign: 'center',
    color: theme.palette.neutral.dark,
    backgroundColor: 'rgba(255,255,255,0.75)',
    zIndex: 1,
  },
});

export default styles;
