const styles = (theme) => ({
  list: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    borderBottom: `1px solid ${theme.palette.divider}`,
    transition: theme.transitions.create(['padding']),
    '&:last-child': {
      borderBottom: 0,
    },
  },
  deptIcon: {
    minWidth: 'auto',
  },
  listDeptBox: {
    borderBottom: `1px solid ${theme.palette.divider}`,
    transition: theme.transitions.create(['padding']),
    height: 60,
    display: 'flex',
    alignItems: 'center',
  },
  listDept: {
    [theme.breakpoints.up('sm')]: {
      display: 'flex',
    },
  },
  listActive: {
    fontWeight: theme.typography.fontWeightMedium,
  },

  user: {
    minHeight: 44,
    padding: theme.spacing(2),
    paddingTop: 2,
    paddingBottom: 2,

    [theme.breakpoints.up('sm')]: {
      minHeight: 52,
      paddingTop: 10, // vertically centering the avatar
      paddingBottom: 0,
    },
  },
  fileUploadDragArea: {
    flexDirection: 'row !important',
    background: 'transparent !important',
    border: 'none !important',
    padding: '10px 16px 10px !important',
    color: 'rgba(0, 0, 0, 0.54) !important',
    transition: theme.transitions.create('background', {
      duration: theme.transitions.duration.shortest,
    }),

    '&:hover': {
      background: 'rgba(0, 0, 0, 0.04) !important',
      color: `${theme.palette.neutral.dark} !important`,
    },
  },
  fileUploadDragLabel: {
    margin: '0 !important',
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    color: theme.palette.neutral.darker,
    ...theme.mixins.ellipsis,
  },
  fileUploadIcon: {
    color: 'inherit !important',
    fontSize: '1.5rem !important',
    marginLeft: theme.spacing(0.5),
    marginRight: theme.spacing(0.5),
  },
  icon: {
    minWidth: 'auto',
    marginLeft: theme.spacing(0.5),
    marginRight: theme.spacing(0.5),
    color: 'inherit',
    transition: theme.transitions.create(['color']),
  },
  iconActive: {
    marginLeft: theme.spacing(0.5),
    marginRight: theme.spacing(0.5),
    color: theme.palette.neutral.dark,
  },
  departmentTitle: {
    fontWeight: '700!important',
  },
  text: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  info: {
    marginLeft: -4,
  },
  avatar: {
    marginRight: (props) => (props.isExpanded ? 12 : 4),
    transition: theme.transitions.create(['margin']),
  },
  divider: (props) => ({
    height: 0,
    marginTop: props.isExpanded ? theme.spacing(2) : 0,
    marginBottom: props.isExpanded ? theme.spacing(2) : 0,
    backgroundColor: 'transparent',
    borderBottom: `1px solid ${props.isExpanded ? theme.palette.neutral.lighter : 'transparent'}`,
    transition: `
      height ${theme.transitions.duration.leavingScreen}ms ${props.isExpanded ? 'step-start' : 'step-end'},
      margin ${theme.transitions.duration.leavingScreen}ms ${theme.transitions.easing.easeInOut},
      border ${theme.transitions.duration.leavingScreen}ms ${theme.transitions.easing.easeInOut}
    `,

    '& + $divider': {
      display: 'none',
    },
  }),
  dividerCollapsed: (props) => ({
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    borderBottom: `1px solid ${theme.palette.neutral.lighter}`,
  }),
  subheader: {
    fontSize: theme.typography.pxToRem(12),
    marginTop: -4,
  },
});

export default styles;
