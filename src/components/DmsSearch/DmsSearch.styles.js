const styles = (theme) => ({
  title: {
    fontSize: theme.typography.pxToRem(13),
    fontWeight: theme.typography.fontWeightMedium,
  },
  icon: {
    flex: '0 1 auto',
    marginRight: 4,
    marginLeft: -2,
    fontSize: theme.typography.pxToRem(32),
    color: theme.palette.primary.main,

    '& > svg': {
      display: 'block',
    },
  },
  multiSelect: {
    flex: '0 1 auto',
    marginRight: 4,
    marginLeft: -2,
    fontSize: theme.typography.pxToRem(32),
    color: theme.palette.primary.main,
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'left',
    flexWrap: 'wrap',

    '& > *': {
      margin: theme.spacing(0.5),
    },
    marginTop: theme.spacing(1),
  },
  button: {
    border: `1px solid ${theme.palette.grey[500]}`,
    borderRadius: 4,
    backgroundColor: 'white',
  },
  noWrap: {
    whiteSpace: 'pre-line',
  },
  selectedDocCount: ({ isMobile }) => ({
    marginLeft: isMobile ? 0 : theme.spacing(17),
  }),
  linkPopover: {
    display: 'inline-block !important',
  },
  uploadedDate: {
    color: theme.palette.secondary.main,
  },
  filterBar: {
    display: 'flex',
    flex: '0 !important',
    minWidth: 0,

    [theme.breakpoints.up('sm')]: {
      minWidth: '0 !important',
    },
  },
  docViewCursor: {
    cursor: 'pointer'
  }
});

export default styles;
