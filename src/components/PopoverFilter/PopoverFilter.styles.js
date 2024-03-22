const styles = (theme) => ({
  root: {
    maxWidth: '100%',
    marginRight: theme.spacing(3.5),
    marginTop: theme.spacing(0.5),
    marginBottom: theme.spacing(0.5),

    '&:last-child': {
      marginRight: 0,
    },
  },
  label: {
    width: '100%',
    fontWeight: theme.typography.fontWeightMedium,
    fontSize: theme.typography.pxToRem(12),
  },
  field: {
    display: 'block',
    marginTop: -4,
    marginLeft: -6,
  },
  btn: {
    padding: '0 6px',
    maxWidth: '100%',
    minHeight: 24,
    textAlign: 'left',
    textTransform: 'none',
    fontSize: theme.typography.pxToRem(12),
    fontWeight: theme.typography.fontWeightRegular,
  },
  btnLabel: {
    justifyContent: 'flex-start',

    '& > span': {
      maxWidth: 'calc(100% - 18px)', // 18px is the width of the btn icon
    },
  },
  text: {
    display: 'flex',
  },
  textLabel: {
    display: 'inline-block',
    maxWidth: 200,
    ...theme.mixins.ellipsis,

    [theme.breakpoints.up('sm')]: {
      maxWidth: 160,
    },

    [theme.breakpoints.up('md')]: {
      maxWidth: 180,
    },

    [theme.breakpoints.up('lg')]: {
      maxWidth: 200,
    },

    [theme.breakpoints.up('xl')]: {
      maxWidth: 240,
    },
  },
  textCount: {
    display: 'inline-block',
    marginLeft: 6,
  },
  popover: ({ maxHeight }) => ({
    maxHeight: `min(calc(100% - 32px), ${maxHeight}px)`,
    display: 'flex',
    flexDirection: 'column',
    width: 240,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  }),
  datePickerContainer: {
    alignItems: 'flex-start',

    '& > div': {
      paddingBottom: 0,
    },
  },
  datepickerInput: {
    paddingTop: 0,
    paddingBottom: 4,
    fontSize: theme.typography.pxToRem(12),
    color: theme.palette.neutral.dark,
    width: 85,
  },
});

export default styles;
