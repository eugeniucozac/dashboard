const styles = (theme) => ({
  tableTitle: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'left',
    marginTop: theme.spacing(1),
  },
  label: {
    fontWeight: theme.typography.fontWeightMedium,
    margin: theme.spacing(1),
  },
  link: {
    color: theme.palette.primary.main,
  },
  toolbar: {
    alignItems: 'center',
    marginTop: theme.spacing(-0.5),
    marginBottom: '0 !important',
  },
  actions: {
    paddingRight: theme.spacing(3),
    marginTop: theme.spacing(0.5),
    marginBottom: theme.spacing(0.5),
  },
  filters: {
    marginTop: theme.spacing(0.5),
    marginBottom: theme.spacing(0.5),
  },
  popoverDept: {
    width: `280px !important`,
  },
  popoverStatus: {
    width: `280px !important`,
  },
  popoverAssureds: {
    width: `360px !important`,
  },
  subTitle: {
    fontWeight: theme.typography.fontWeightBold,
    textTransform: 'uppercase',
    fontSize: theme.typography.pxToRem(14),
  },
  tableHead: {
    '& th': {
      fontWeight: theme.typography.fontWeightBold,
    },
  },
  overFlowTable: () => ({
    width: '100%',
    '&&': {
      [theme.breakpoints.up('md')]: {
        overflow: 'auto',
        height: 'calc(60vh - 100px)',
      },
      [theme.breakpoints.up('lg')]: {
        overflow: 'auto',
        height: 'calc(70vh - 100px)',
      },

      [theme.breakpoints.up('xl')]: {
        overflow: 'auto',
        height: 'calc(90vh - 100px)',
      },
    },
  }),

  apiFechErrorIcon: {
    color: theme.palette.error.light,
    height: '80%',
    width: '80%',
  },
});

export default styles;
