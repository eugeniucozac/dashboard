const styles = (theme) => ({
  rightListItem: { flexDirection: 'row-reverse' },
  table: {
    // temporary right-to-left patch, waiting for
    // https://github.com/bvaughn/react-virtualized/issues/454
    '& .ReactVirtualized__Table__headerRow': {
      ...(theme.direction === 'rtl' && {
        paddingLeft: '0 !important',
      }),
      ...(theme.direction !== 'rtl' && {
        paddingRight: undefined,
      }),
    },
  },
  tableRow: {
    cursor: 'pointer',
  },
  tableRowHover: {
    '&:hover': {
      backgroundColor: theme.palette.grey[200],
    },
  },
  tableCell: {
    flex: 1,
  },

  flexContainer: {
    display: 'flex',
    alignItems: 'center',
    boxSizing: 'border-box',
  },
  noClick: {
    cursor: 'initial',
  },

  title: {
    paddingBottom: '50px !important',
  },
  close: {
    position: 'absolute',
    top: 11,
    right: 11,
  },
  toolbar: {
    minHeight: theme.mixins.header.default.minHeight - 3, // minus 3px for border-top

    [theme.breakpoints.down('xs')]: {
      flexWrap: 'wrap',
    },
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    overflow: 'auto',
  },
  iconContainer: {
    height: 24,
    fontSize: 24,
    fontWeight: 700,
  },
  linearProgress: { height: 2 },
  card: {
    width: '100%',
    margin: theme.typography.pxToRem(20),
    backgroundColor: 'white',
    transition: 'box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
    overflow: 'hidden',
    boxShadow: 'rgb(145 158 171 / 24%) 0px 0px 2px 0px, rgb(145 158 171 / 24%) 0px 16px 32px -4px',
    borderRadius: '5px',
    position: 'relative',
    height: '100%',
    padding: 0,
    marginTop: 20,
  },
  cardArray: {
    padding: 10,
  },
  cardTitle: {
    backgroundColor: theme.palette.primary.main,
    display: 'flex',
    justifyContent: 'space-between',
  },
  cardTitleHeading: {
    fontWeight: 600,
    color: 'white',
    marginBottom: 0,
  },
  editIcon: {
    color: 'white',
    fontSize: theme.typography.pxToRem(18),
  },
  cardContainer: {
    height: theme.typography.pxToRem(100),
    margin: 10,
  },
  dataTable: { width: '100%', tableLayout: 'fixed', border: '1px solid rgba(224, 224, 224, 1)', borderRadius: '4px' },
  tableHeadCell: {
    borderBottom: `1px solid ${theme.palette.grey[300]}`,
  },
  tableHead: {
    fontWeight: 700,
  },
  sizeSmall: {
    padding: '5px 0',
    paddingRight: 4,

    '&:first-child': {
      paddingLeft: 4,
    },

    '&:last-child': {
      paddingRight: 4,
    },
  },
  tableCellLabel: {
    fontSize: theme.typography.pxToRem(11),
    fontWeight: theme.typography.fontWeightRegular,
    color: theme.palette.grey[600],
  },
  selectedRow: {
    backgroundColor: '#0000000a',
    cursor: 'pointer',
  },
});

export default styles;
