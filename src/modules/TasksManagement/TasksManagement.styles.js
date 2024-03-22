const styles = (theme) => ({
  searchInput: {
    flex: '1 1 auto',
  },
  searchSort: {
    cursor: 'pointer',
    margin: theme.spacing(1),
  },
  searchFilter: {
    cursor: 'pointer',
    margin: theme.spacing(1),
  },
  filterBox: {
    height: theme.spacing(4),
    display: 'flex',
    alignItems: 'center',
  },
  search: {
    maxWidth: '70% !important',
  },
  searchMaxWidth: {
    maxWidth: '90% !important',
    minWidth: '45% !important',
    width: '68% !important',
    marginLeft: '3% !important',
  },
  searchLeft: {
    marginLeft: '3px !important',
  },
  radioLabel: {
    marginTop: '0px !important',
    '& label': {
      marginRight: '8px !important',
    },
  },
  viewLabel: {
    marginTop: '8px!important',
    fontWeight: 800,
  },
  root: {
    flex: '1 !important',
  },
  title: {
    marginBottom: 6,
    fontWeight: theme.typography.fontWeightBold,
  },
  sectionHeader: {
    fontSize: theme.typography.pxToRem(11),
  },
  taskFunctionList: {
    listStyle: 'none',
    paddingLeft: '20px !important',
    paddingRight: '20px !important',
  },
  headerButtons: {
    [theme.breakpoints.up('sm')]: {
      flex: '1 0 60% !important',
    },
  },
  headerContent: {
    display: 'flex',
    alignItems: 'flex-start',
  },
  rowDetail: {
    marginBottom: 6,
  },
  optionValue: {
    height: '30px',
  },
  optionLabel: {
    padding: '0 3px 0 0',
    width: '50%',
  },
  selectAutocomplete: {
    '& .MuiInputBase-root': {
      height: '32px',
      alignContent: 'center',
      marginRight: '32px',
    },
  },
  checkSingningLable: {
    marginRight: 12,
    marginTop: '1em',
  },
  defaultSwitch: {
    '& > span': {
      color: 'white',
    },
    '& > span:hover': {
      color: 'white',
    },
    '& > span.Mui-checked': {
      color: '#334762',
    },
    '& > span.Mui-checked + .MuiSwitch-track': {
      'background-color': '#334762',
    },
  },
  multiSelectContainer: {
    display: 'flex',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    flex: '0.5',
  },
  multiSelectTitle: {
    paddingTop: theme.spacing(1.5),
  },
});

export default styles;
