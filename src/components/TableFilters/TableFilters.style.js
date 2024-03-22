const styles = (theme) => ({
  root: {
    display: 'flex',
    flex: 1,
    justifyContent: 'flex-end',
    maxWidth: 320,
    marginLeft: 'auto',

    [theme.breakpoints.up('sm')]: {
      maxWidth: 320,
      minWidth: 240,
    },
  },
  search: {
    marginLeft: theme.spacing(0.5),
  },
  inputPropsRoot: {
    fontSize: theme.typography.pxToRem(12),

    '& > input': {
      paddingTop: '5.5px !important',
      paddingBottom: '5.5px !important',
    },
  },
  filtersContainer: ({ filtersExpanded }) => ({
    width: '100%',
    flexBasis: '100%',
    marginTop: theme.spacing(filtersExpanded ? 2 : 0),
    transition: theme.transitions.create(['margin']),
  }),
  filters: {
    display: 'flex',
    width: '100%',
    border: `1px solid ${theme.palette.neutral.medium}`,
    borderRadius: 2,
    padding: theme.spacing(1.5),
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(0),
  },
  filtersContent: {
    flex: '1 1 auto',
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    width: '100%',
  },
  filtersButtons: {
    flex: '0 0 auto',
    display: 'flex',
    alignItems: 'flex-end',
    flexDirection: 'column',
    marginTop: 1,
    marginRight: theme.spacing(-0.75),
    marginBottom: theme.spacing(-0.25),
    marginLeft: theme.spacing(2),
  },
  advancedSearchPopover: {
    maxHeight: 'calc(100% - 96px)',
    display: 'flex',
    width: 'calc(100% - 32px)',
    padding: 0,

    [theme.breakpoints.up('sm')]: {
      width: 'calc(100% - 144px)', // 144px for left and right app layout margins
    },

    [theme.breakpoints.up('md')]: {
      maxWidth: 860,
    },

    [theme.breakpoints.up('lg')]: {
      maxWidth: 1040,
    },
  },
  advancedSearchClose: {
    position: 'absolute',
    top: 4,
    right: 4,
  },
  advancedSearchButtons: {
    padding: theme.spacing(2.5, 4),
  },
  columnsPopover: {
    maxHeight: 'calc(100% - 32px)',
    display: 'flex',
    flexDirection: 'column',
    width: 240,
    padding: theme.spacing(2),
  },
  columnsList: {
    overflow: 'auto',
    marginTop: theme.spacing(0.5),
  },
  columnsListItem: {
    paddingBottom: 3,
    paddingLeft: theme.spacing(1.5),
  },
  columnsListItemIcon: {
    minWidth: 30,
    marginLeft: theme.spacing(-1),

    '& > span': {
      padding: 0,
    },
  },
});

export default styles;
