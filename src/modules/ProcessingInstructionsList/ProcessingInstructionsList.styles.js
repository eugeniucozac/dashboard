import defaults from '../../theme/theme-defaults';

const styles = (theme) => ({
  chips: {
    display: 'flex',
    justifyContent: 'left',
    flexWrap: 'wrap',

    '& > *': {
      margin: theme.spacing(0.5),
    },
  },
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
    color: defaults.palette.primary.main,
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
});

export default styles;
