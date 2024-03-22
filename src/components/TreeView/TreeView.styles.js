const styles = (theme) => ({
  root: {
    marginTop: theme.spacing(2),
    marginRight: theme.spacing(3),
    // full width (100%) minus margin-right (spacing 3) and width of drawer expand/collapse button (24px)
    width: `calc(100% - ${theme.spacing(3)}px - 24px)`,
  },
  searchRoot: {
    fontSize: theme.typography.pxToRem(12),

    '& > input': {
      paddingTop: '5.5px !important',
      paddingBottom: '5.5px !important',
    },
  },
  searchBtn: {
    height: 30,
  },
  column1: {
    flex: '1 1 60%',
    overflow: 'hidden',
  },
  column2: {
    flex: '1 0 auto',
    textAlign: 'right',
  },
  header: {
    fontSize: theme.typography.pxToRem(11),
    fontWeight: theme.typography.fontWeightMedium,
  },
  divider: {
    marginBottom: theme.spacing(0.5),
  },
  treeItem: {
    display: 'flex',
    flexWrap: 'nowrap',
  },
  parent: {
    fontWeight: theme.typography.fontWeightMedium,
  },
  label: {
    padding: 2,
    fontSize: theme.typography.pxToRem(11),
    lineHeight: 1.25,
  },
  file: {
    display: 'flex',
    flexWrap: 'nowrap',
    flex: '1 1 auto',
  },
  status: {
    flex: '0 0 auto',
    marginRight: theme.spacing(0.5),
  },
  name: {
    ...theme.mixins.ellipsis,
  },
  date: {
    color: theme.palette.neutral.main,
  },
  treeItemRoot: {
    '& .MuiTreeItem-group': {
      marginLeft: 12,
    },
    '& .MuiTreeItem-iconContainer': {
      width: 12,
      marginRight: 0,
    },
    '& .MuiTreeItem-label': {
      margin: '2px 0',
      paddingLeft: 2,
      // full width (100%) minus width of tree view spacer (12px)
      width: 'calc(100% - 12px)',
    },
  },
  treeItemLabel: {
    '& > span': {
      display: 'block !important',
    },
  },
  toolTipOuterWrapper: {
    display: 'block !important',
  },
});

export default styles;
