const styles = (theme) => ({
  panel: (props) => ({
    '&:before': {
      backgroundColor: 'rgba(0,0,0,0.06)',
    },

    ...(props.blank && {
      boxShadow: 'none',

      '&:before': {
        display: 'none',
      },
    }),

    '& .Mui-expanded': {
      margin: 0,

      '& svg': {
        transform: 'scaleY(-1)',
      },
    },
  }),
  summary: ({ blank }) => ({
    padding: `0 ${theme.spacing(1.5)}px`,
    minHeight: '32px !important',
    ...(blank && { padding: 0 }),
  }),
  summaryContent: ({ density }) => ({
    margin: `${theme.spacing(density === 'compact' ? 0.5 : density === 'comfortable' ? 2 : 1)}px 0 !important`,
    maxWidth: '100%',
  }),
  header: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    maxWidth: '100%',
    padding: '0 !important',
  },
  customHeader: {
    display: 'flex',
    alignItems: 'center',
    maxWidth: '100%',
    padding: '0 !important',
  },
  arrow: {
    flex: '0 0 auto',
    marginRight: theme.spacing(1.5),
    verticalAlign: 'middle',
    transition: theme.transitions.create('transform'),
  },
  title: {
    flex: '1 1 auto',
    margin: 0,
  },
  actions: {
    flex: '0 0 auto',
    flexWrap: 'nowrap',
    display: 'flex',

    '& > *': {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(0.5),
      verticalAlign: 'middle',
    },
  },
  actionsText: {
    fontSize: theme.typography.pxToRem(11),
  },
  actionsIcon: {
    fontSize: theme.typography.pxToRem(18),
    transform: 'scaleY(1) !important',
  },
  details: (props) => ({
    padding: '6px 20px 18px',

    ...(props.blank && {
      padding: `0 0 ${theme.spacing(2.5)}px 4px`,
    }),
  }),
});

export default styles;
