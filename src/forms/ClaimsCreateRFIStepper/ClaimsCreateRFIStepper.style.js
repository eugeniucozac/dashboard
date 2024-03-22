const styles = (theme) => ({
  root: {
    ...theme.mixins.modal.dialog.root,
    display: 'flex',
  },

  content: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(2),
    // hack to prevent glitch with swipeable-react-views where 1 pixel of previous slide is visible
    // extra 6px padding to make sure form fields hover state are not cutoff by parent overflow:hidden
    paddingLeft: 7,
    paddingRight: 7,
    overflowX: 'hidden',
  },
  formContent: (props) => ({
    height: props.fullScreen ? '65vh' : '50vh',
    '@media (min-height: 800px)': {
      height: props.fullScreen ? '70vh' : '60vh',
    },
  }),
  iconContainer: {
    height: 24,
    fontSize: 24,
    fontWeight: 700,
  },
  iconContainerCompleted: {
    height: 24,
    fontSize: 24,
    fontWeight: 700,
    cursor: "pointer"
  },
  linearProgress: { height: 2 },
  summary: (props) => ({
    backgroundColor: theme.palette.grey[50],
    height: props.fullScreen ? '65vh' : '50vh',
    '@media (min-height: 800px)': {
      height: props.fullScreen ? '70vh' : '60vh',
    },
  }),
  gridLabel: {
    borderWidth: 'thin',
    borderStyle: 'solid',
    borderColor: theme.palette.neutral.light,
    borderRadius: '5px',
    backgroundColor: theme.palette.grey[50],
  },
  highlight: {
    position: 'relative',

    '&:before': {
      content: '""',
      display: 'block',
      position: 'absolute',
      top: -6,
      left: -6,
      width: `calc(100% + 12px)`,
      height: `calc(100% + 12px)`,
      borderRadius: 8,
      ...theme.mixins.highlight.default,
    },
  },
  tabsContent: {
    // -6px margin to reposition the tab content in its place (see extra 6px padding above)
    marginLeft: -6,
    marginRight: -6,
  },
  legend: {
    '&:not(:first-child) > legend': {
      marginTop: '0px !important',
    },
    '& > legend': {
      marginBottom: 0,
    },
  },
  spacer: {
    padding: '0 !important',
  },
  stepper: {
    padding: theme.spacing(1)
  }
});

export default styles;
