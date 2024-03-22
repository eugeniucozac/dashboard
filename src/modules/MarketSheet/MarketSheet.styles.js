const styles = (theme) => ({
  table: {
    paddingBottom: theme.spacing(1),
  },

  btnAddLayer: {
    float: 'right',
    marginBottom: theme.spacing(2),
  },

  btnSmall: {
    display: 'flex',
    whiteSpace: 'nowrap',
  },

  toggleMudmap: {
    '& svg': {
      transform: 'scaleY(1)',
      transition: theme.transitions.create(['transform']),
    },
  },

  toggleMudmapExpanded: {
    '& svg': {
      transform: 'scaleY(-1)',
    },
  },

  toggleCobrokers: {
    fontSize: theme.typography.pxToRem(11),
  },

  capacity: {
    minWidth: '120px !important',
    maxWidth: '160px !important',
  },

  appBar: {
    borderTop: 0,
  },

  mudmapHeader: {
    ...theme.mixins.header.default,
  },

  mudmapTitle: {
    marginBottom: 0,
  },

  mudmapFullscreen: {
    position: 'fixed',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    padding: theme.spacing(2),
    paddingTop: theme.mixins.header.height + theme.spacing(2),
    margin: 0,
    background: 'white',
    zIndex: theme.zIndex.drawer - 1,
  },
});

export default styles;
