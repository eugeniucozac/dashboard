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
  inputPropsRoot: {
    fontSize: theme.typography.pxToRem(12),

    '& > input': {
      paddingTop: '5.5px !important',
      paddingBottom: '5.5px !important',
    },
  },
  tableToolbarRoot: {
    margin: theme.spacing(1, 0, 0, 0.75)
  },
  tableToolbarRootforClaims: {
    marginTop: theme.spacing(17.5),
  },
  fileDropWrapper: {
    padding: theme.spacing(1),
  },
  fileDropWrapperDisabled: {
    padding: theme.spacing(1),
    pointerEvents: 'none'
  },
  fileDropWrapperContainerDisabled: {
    cursor: 'not-allowed',
  },
  multiSelectContainer: {
    display: 'flex',
    justifyContent: 'left',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    marginTop: theme.spacing(2.5),
  },
  multiSelectTitle: {
    flex: '0 1 auto',
    marginTop: 3,
    marginRight: theme.spacing(1),
    color: theme.palette.primary.main,
  },
  fileIconColor: {
    color: `${theme.palette.primary.main} !important`,
  },
  fileNameSize: {
    fontSize: theme.typography.pxToRem(10),
  },
  link: {
    textDecoration: 'underline',
  },
});

export default styles;
