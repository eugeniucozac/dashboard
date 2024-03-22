const styles = (theme) => ({
  root: ({ expanded }) => ({
    marginTop: theme.spacing(-4),
    marginBottom: theme.spacing(expanded ? 4 : 0),
    transition: theme.transitions.create('margin'),

    '& h4': {
      fontWeight: theme.typography.fontWeightRegular,
      fontSize: theme.typography.pxToRem(12),
      paddingLeft: theme.spacing(0.5),
      marginBottom: -2,
      opacity: expanded ? 1 : 0,
      transition: theme.transitions.create('opacity'),
    },

    '& div[role="button"]': {
      cursor: 'default !important',
    },
  }),
  container: {
    display: 'flex',
    alignItems: 'stretch',
    flexWrap: 'wrap',
    width: '100%',

    [theme.breakpoints.up('sm')]: {
      flexWrap: 'nowrap',
    },
  },
  wrapper: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    border: `1px solid ${theme.palette.neutral.light}`,
    padding: theme.spacing(0, 0.5),
    marginBottom: theme.spacing(2),

    [theme.breakpoints.up('sm')]: {
      flexWrap: 'wrap',
      width: 'calc(50% - 8px)',

      '&:first-child': {
        marginRight: theme.spacing(2),
      },
    },
  },
  canvas: {
    flex: '1 0 auto',
    width: '33.3333%',
    padding: theme.spacing(2),

    [theme.breakpoints.up('sm')]: {
      minWidth: 175,
      maxWidth: 215,
      marginLeft: 'auto',
      marginRight: 'auto',
    },

    [theme.breakpoints.up('md')]: {
      minWidth: 'auto',
      maxWidth: 155,
      maxHeight: 155,
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
      paddingBottom: theme.spacing(0),
    },
  },
  content: {
    flex: '1 1 auto',
    width: '66.6667%',
    padding: theme.spacing(2),
  },
  chartRoot: {
    height: 'auto !important',
    width: 'auto !important',
    maxWidth: '100%',
  },
  chart: {
    margin: theme.spacing(0, 'auto'),
    maxWidth: '100%',
    height: 'auto !important',
  },
  toggleBtnLink: {
    fontSize: `${theme.typography.pxToRem(13)} !important`,
    textTransform: 'uppercase',
  },
  toggleBtnIcon: ({ expanded }) => ({
    fontSize: `${theme.typography.pxToRem(24)} !important`,
    transform: `scaleY(${expanded ? 1 : -1}) !important`,
    transition: theme.transitions.create('transform'),
  }),
  section: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-between',
  },
  layers: {
    margin: theme.spacing(1, 0),
    fontWeight: theme.typography.fontWeightBold,
    color: theme.palette.neutral.main,
    marginBottom: theme.spacing(0.5),
    fontSize: theme.typography.pxToRem(12),

    [theme.breakpoints.up('md')]: {
      fontSize: theme.typography.pxToRem(14),
    },

    '& strong': {
      display: 'inline-flex',
      color: theme.palette.neutral.dark,
      fontWeight: theme.typography.fontWeightBold,
    },
  },
  box: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    border: `1px solid ${theme.palette.neutral.light}`,
    padding: theme.spacing(0.75, 1.5),
    margin: theme.spacing(0.75, 0),
    width: '60%',

    [theme.breakpoints.up('md')]: {
      width: '50%',
    },

    [theme.breakpoints.up('lg')]: {
      width: '60%',
    },
  },
  taskLabelBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'right',
    border: `1px solid ${theme.palette.neutral.light}`,
    padding: theme.spacing(0.75, 1.5),
    margin: theme.spacing(0.75, 0),
  },
  taskBorderRight: {
    margin: theme.spacing(0, 2),
    borderRight: `1px solid ${theme.palette.neutral.light}`,
  },
  boxMultiple: {
    flex: 1,
  },
  type: {
    display: 'inline-flex',
    flex: 1,
    color: theme.palette.neutral.main,
    fontSize: theme.typography.pxToRem(11),

    [theme.breakpoints.up('md')]: {
      fontSize: theme.typography.pxToRem(12),
    },
  },
  value: {
    float: 'right',
    display: 'inline-flex',
    verticalAlign: 'middle',
    fontSize: theme.typography.pxToRem(11),
    fontWeight: theme.typography.fontWeightBold,

    [theme.breakpoints.up('md')]: {
      fontSize: theme.typography.pxToRem(12),
    },
  },
  valueSpacing: {
    marginRight: theme.spacing(1),
    paddingRight: theme.spacing(1),
    width: '20%',
    justifyContent: 'center',
  },
  groupContainer: {
    flex: 1,
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginRight: theme.spacing(2),
    minWidth: '30%',

    [theme.breakpoints.up('md')]: {
      flexWrap: 'nowrap',
      width: '40%',
      marginRight: theme.spacing(1),
    },

    [theme.breakpoints.up('lg')]: {
      width: '30%',
    },
  },
  group: {
    fontWeight: theme.typography.fontWeightBold,
    fontSize: theme.typography.pxToRem(12),
    display: 'inline-flex',

    [theme.breakpoints.up('lg')]: {
      whiteSpace: 'nowrap',
    },
  },
  divider: {
    width: '100%',
    margin: '5px 0 4px',
  },
  dot: {
    flex: '0 0 12px',
    height: 12,
    width: 12,
    borderRadius: '50%',
    marginRight: theme.spacing(1),
    backgroundColor: theme.palette.neutral.medium,
  },
  dotGreen: {
    backgroundColor: 'rgb(27,204,12)',
  },
  dotOrange: {
    backgroundColor: theme.palette.error.light,
  },
  totalTasksSpacing: {
    padding: '2%',
  },
  tasksLblBoxAlign: {
    justifyContent: 'center',
  },
});

export default styles;
